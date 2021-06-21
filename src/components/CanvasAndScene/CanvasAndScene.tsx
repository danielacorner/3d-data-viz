import { Suspense } from "react";
import { useWindowSize } from "../../utils/hooks";
import * as THREE from "three";
import { Html, Detailed } from "@react-three/drei";
import {
  Environment,
  OrbitControls,
  Sky,
  Stars,
  Stats,
} from "@react-three/drei";
import Youtubes from "./Youtubes/Youtubes";
import { Lighting } from "../Lighting/Lighting";
import { Controls } from "react-three-gui";
import {
  initialYoutubeIdAtom,
  isInfoOverlayVisibleAtom,
  lookAtTargetAtom,
  playersAtom,
} from "../../store/store";
import { Canvas } from "@react-three/fiber";
import { ErrorBoundary } from "../ErrorBoundary";
import { CAMERA_POSITION_INITIAL } from "../../utils/constants";
import { useTurbidityByTimeOfDay } from "./useTurbidityByTimeOfDay";
import { useAtom } from "jotai";
import QueryClientProviderWithClient from "../QueryClientProviderWithClient";

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
          <ErrorBoundary component={<Html>❌ CanvasAndScene</Html>}>
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
  // const [isCameraAnimating] = useAtom(isCameraAnimatingAtom);
  const [lookAtTarget] = useAtom(lookAtTargetAtom);
  const [initialYoutubeId] = useAtom(initialYoutubeIdAtom);

  const [players] = useAtom(playersAtom);
  const initialYoutubeIdDisplay =
    players.length > 0 ? players[0].videoId : initialYoutubeId;
  return (
    <QueryClientProviderWithClient>
      <ErrorBoundary component={<Html>❌ Scene</Html>}>
        <OrbitControls target={lookAtTarget} {...({} as any)} />
        <Stars count={1000} />
        <Environment background={false} path={"/"} preset={"night"} />
        <Sky
          rayleigh={7}
          mieCoefficient={0.1}
          mieDirectionalG={1}
          turbidity={turbidity}
        />
        {initialYoutubeIdDisplay ? (
          <Youtubes {...{ initialYoutubeId: initialYoutubeIdDisplay }} />
        ) : (
          (null as any)
        )}
      </ErrorBoundary>
    </QueryClientProviderWithClient>
  );
}

export const SECONDS_IN_DAY = 24 * 60 * 60;
export const TURBIDITY = { max: 0, min: 100 };
