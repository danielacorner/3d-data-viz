import { Box, useDetectGPU } from "@react-three/drei";
import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useSpring, animated } from "@react-spring/three";
import { useIsZoomed, useStore } from "../store/store";
import RGBLights from "./RGBLights";
import { useControl } from "react-three-gui";

export function Lighting() {
  return (
    <>
      <color attach="background" args={["#272727"] as any} />
      <LightFollowsMouse />
      {/* {process.env.NODE_ENV === "development" && <GizmoViewcube />} */}
      {/* <SpotLightOnSelectedProtein /> */}
      <ambientLight intensity={0.3} />
      <pointLight position={[-10, -10, -10]} intensity={1} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.5}
        penumbra={1}
        intensity={2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />
    </>
  );
}
function LightFollowsMouse() {
  const light = useRef(null as any);
  const spotlightRef = useRef(null as any);
  const box = useRef(null as any);
  const spotlightBox = useRef(null as any);
  const isZoomed = useIsZoomed();
  const isRollingDie = useStore((s) => s.isRollingDie);
  const isRollingComplete = useStore((s) => s.isRollingComplete);
  const isD20Opaque = isRollingDie || isZoomed;

  const { viewport, mouse } = useThree();

  // mouse.x goes from -1 -> 1
  // viewport.width ~= 20

  useFrame((state) => {
    const [x, y, z] = [
      mouse.x * viewport.width,
      mouse.y * viewport.height,
      // z goes from 0 -> -1 -> 0
      Math.cos(Math.PI * mouse.x) * viewport.width * 0.8,
    ];

    const [sx, sy, sz] = [mouse.x * 4, mouse.y * 4, 8];
    // Makes the light follow the mouse

    //
    spotlightRef.current?.position.set(sx, sy, sz);
    spotlightRef.current?.lookAt(0, 0, 0);
    if (process.env.NODE_ENV === "development") {
      spotlightBox.current?.position.set(sx, sy, sz);
    }

    light.current?.position.set(x, y, z);
    if (process.env.NODE_ENV === "development") {
      box.current?.position.set(x, y, z);
    }
  });

  const spotlight2Intensity = useControl("spotlight2Intensity", {
    type: "number",
    min: -400,
    max: 800,
    value: 44,
  });
  const spotlightIntensity = useControl("spotlightIntensity", {
    type: "number",
    min: -30,
    max: 20,
    value: 0,
  });
  const pointlightIntensity = useControl("pointlightIntensity", {
    type: "number",
    min: -5,
    max: 5,
    value: 0,
  });

  const springProps = useSpring({
    spotlightIntensity: !isD20Opaque ? spotlightIntensity : 10,
    spotlight2Intensity: !isD20Opaque ? 0 : spotlight2Intensity,
    pointlightIntensity: !isD20Opaque ? pointlightIntensity : 6,
    directionalLightIntensity: isRollingComplete ? 20 : 0,
  });

  const gpuInfo = useDetectGPU();

  return (
    <>
      {gpuInfo?.tier && gpuInfo.tier >= 3 && (
        <>
          <RGBLights />
          <animated.pointLight
            ref={light} /* this one follows the mouse */
            decay={0}
            distance={0}
            intensity={springProps.pointlightIntensity}
            castShadow={true}
            color="white"
          />
          <animated.spotLight
            intensity={springProps.spotlightIntensity}
            ref={spotlightRef} /* this one follows the mouse*/
            castShadow={true}
            color="white"
          />
        </>
      )}
      {false && process.env.NODE_ENV === "development" && (
        <>
          <Box ref={box} {...({} as any)} />
        </>
      )}
      <animated.pointLight
        intensity={
          springProps.spotlight2Intensity
        } /* shines on front face of D20 */
        position={[-1, 2.5, 9]}
        castShadow={true}
        color="whitesmoke"
      />
      {isRollingDie && (
        <animated.directionalLight
          intensity={springProps.directionalLightIntensity}
          color="white"
          position={[-1, 2.5, 50]}
          castShadow={true}
        />
      )}
    </>
  );
}
