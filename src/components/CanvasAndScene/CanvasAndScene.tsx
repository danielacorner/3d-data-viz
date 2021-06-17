import { Suspense, useEffect, useState } from "react";
import { useWindowSize } from "../../utils/hooks";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import {
  Environment,
  OrbitControls,
  Sky,
  Stars,
  Stats,
} from "@react-three/drei";
import Youtubes from "../Youtubes";
import { Lighting } from "../Lighting/Lighting";
import { Controls } from "react-three-gui";
import {
  isInfoOverlayVisibleAtom,
  isRollingCompleteAtom,
  isRollingDieAtom,
  resetPositionKeyAtom,
  useIsZoomed,
} from "../store/store";
import { useFrame, Canvas } from "@react-three/fiber";
import { ErrorBoundary } from "../ErrorBoundary";
import {
  CAMERA_POSITION_INITIAL,
  INITIAL_CAMERA_POSITION,
} from "../../utils/constants";
import { useTurbidityByTimeOfDay } from "./useTurbidityByTimeOfDay";
import { useAtom } from "jotai";

const CONTROLLED = false;
const Canv = CONTROLLED ? Controls.Canvas : Canvas;

export default function CanvasAndScene() {
  const windowSize = useWindowSize();
  const [isInfoOverlayVisible] = useAtom(isInfoOverlayVisibleAtom);

  return (
    <Suspense fallback={null}>
      <Controls.Provider>
        <Canv
          onCreated={({ gl }) => {
            gl.setPixelRatio(window.devicePixelRatio);
            gl.outputEncoding = THREE.sRGBEncoding;
            gl.physicallyCorrectLights = true;
            gl.shadowMap.enabled = true;
            gl.shadowMap.type = THREE.PCFSoftShadowMap;
            gl.toneMapping = THREE.ACESFilmicToneMapping;
          }}
          gl={{ antialias: false, alpha: false }}
          {...{ camera: { fov: 75, position: CAMERA_POSITION_INITIAL } }}
          style={{ height: windowSize.height, width: windowSize.width }}
        >
          {/* <SpinScene> */}
          <ErrorBoundary component={<Html>❌ Scene</Html>}>
            <Scene />
            {isInfoOverlayVisible && <Stats className="fpsStats" />}
          </ErrorBoundary>
          {/* </SpinScene> */}
          <Lighting />
        </Canv>
        {process.env.NODE_ENV !== "production" &&
          isInfoOverlayVisible &&
          CONTROLLED && <Controls style={{ zIndex: 99999 }} />}
      </Controls.Provider>
    </Suspense>
  );
}

function Scene() {
  const turbidity = useTurbidityByTimeOfDay();
  useResetCameraWhenZoomed();
  useResetCameraOnResetPositionButtonClick();
  return (
    <>
      <OrbitControls {...({} as any)} />
      {/* {false && process.env.NODE_ENV === "development" ? (
        <OrbitControls {...({} as any)} />
      ) : !isZoomed ? (
        <DeviceOrientationOrbitControls />
      ) : null} */}
      <Stars count={1000} />
      <Environment background={false} path={"/"} preset={"night"} />
      <Sky
        rayleigh={7}
        mieCoefficient={0.1}
        mieDirectionalG={1}
        turbidity={turbidity}
      />
      <Youtubes />
      {/* <Physics
        {...{ ...PHYSICS_PROPS, gravity: [0, 0, isRollingDie ? -30 : 0] }}
      >
        <Debugger>
          <ErrorBoundary component={<Html>❌ rollTheDieCannonRef</Html>}>
            <D20AndPlanes />
          </ErrorBoundary>
        </Debugger>
      </Physics> */}
    </>
  );
}
// function D20AndPlanes() {
//   return (
//     <mesh>
//       <ErrorBoundary component={<Html>❌ SpinningParticle</Html>}>
//         <SpinningParticle />
//       </ErrorBoundary>
//       <Walls />
//     </mesh>
//   );
// }

const ANIMATION_SPEED = 0.07; // 0 to 1
function useResetCameraWhenZoomed() {
  const isZoomed = useIsZoomed();
  const [isRollingDie] = useAtom(isRollingDieAtom);
  const [isRollingComplete] = useAtom(isRollingCompleteAtom);
  // const camera = useThree(({ camera }) => camera);

  const isResettingCameraPosition =
    !isRollingDie && (isZoomed || isRollingComplete);
  useResetCameraPosition(isResettingCameraPosition);
}

export const SECONDS_IN_DAY = 24 * 60 * 60;
export const TURBIDITY = { max: -50, min: 100 };

// function Debugger({ children }) {
//   return process.env.NODE_ENV === "development" ? (
//     <Debug color="black">{children}</Debug>
//   ) : (
//     <>{children}</>
//   );
// }

const CAMERA_RESETTING_TIME = 500;
function useResetCameraOnResetPositionButtonClick() {
  const [resetPositionKey] = useAtom(resetPositionKeyAtom);

  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    setIsResetting(true);
    const timer = window.setTimeout(
      () => setIsResetting(false),
      CAMERA_RESETTING_TIME
    );
    return () => window.clearTimeout(timer);
  }, [resetPositionKey]);

  useResetCameraPosition(isResetting);
}

function useResetCameraPosition(isResetting: boolean) {
  useFrame(({ camera }) => {
    if (isResetting) {
      const delta = {
        x: INITIAL_CAMERA_POSITION.x - camera.position.x,
        y: INITIAL_CAMERA_POSITION.y - camera.position.y,
        z: INITIAL_CAMERA_POSITION.z - camera.position.z,
      };

      camera.position.x =
        INITIAL_CAMERA_POSITION.x - delta.x * (1 - ANIMATION_SPEED);
      camera.position.y =
        INITIAL_CAMERA_POSITION.y - delta.y * (1 - ANIMATION_SPEED);
      camera.position.z =
        INITIAL_CAMERA_POSITION.z - delta.z * (1 - ANIMATION_SPEED);

      camera.lookAt(0, 0, 0);
    }
  });
}
