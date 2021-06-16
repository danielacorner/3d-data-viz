import { useFrame } from "@react-three/fiber";
import React from "react";
import { useIsZoomed, useStore } from "../../store/store";
import { useRotateWithScroll } from "../useRotateWithScroll";
import {
  SPEED_Y,
  AMPLITUDE_Y,
  SPEED_X,
  AMPLITUDE_X_INV,
} from "./SpinningParticle";

export function useSpinObjects(
  ref3: React.MutableRefObject<any>,
  ref4: React.MutableRefObject<any>,
  ref5: React.MutableRefObject<any>
) {
  const isZoomed = useIsZoomed();
  const isRollingDie = useStore((s) => s.isRollingDie);
  const d20Rotation = useRotateWithScroll();

  const rotationSpeed = !isZoomed ? 0.12 : 0.05;

  // manually detect when we just went from isZoomed to !isZoomed
  const isZoomingOut = useStore((s) => s.isZoomingOut);

  const shouldResetRotation = isRollingDie;

  // spin the particle
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (!ref3.current) {
      return;
    }

    // ref3 is the d20
    const targetX = shouldResetRotation
      ? 0
      : Math.sin(time * SPEED_Y) * AMPLITUDE_Y;
    const targetY = shouldResetRotation
      ? 0
      : ref3.current.rotation.y + Math.cos(time * SPEED_X) * AMPLITUDE_X_INV;
    const targetZ = shouldResetRotation ? 0 : ref3.current.rotation.z;
    if (isZoomingOut) {
      // move in a spring animation from [x,y,z] to the time-based sine curve
      const deltaX = targetX - ref3.current.rotation.x;
      ref3.current.rotation.x =
        ref3.current.rotation.x + deltaX * rotationSpeed;
      const deltaY = targetY - ref3.current.rotation.y;
      ref3.current.rotation.y =
        ref3.current.rotation.y + deltaY * rotationSpeed;
    } else if (isZoomed && !isRollingDie) {
      // move in a spring animation from [x,y,z] to rotation
      // e.g. 5 -> 2
      // 5 = 5 + (2-5)/2
      const deltaX = d20Rotation.x - ref3.current.rotation.x;
      ref3.current.rotation.x =
        ref3.current.rotation.x + deltaX * rotationSpeed;
      const deltaY = d20Rotation.y - ref3.current.rotation.y;
      ref3.current.rotation.y =
        ref3.current.rotation.y + deltaY * rotationSpeed;
      const deltaZ = d20Rotation.z - ref3.current.rotation.z;
      ref3.current.rotation.z =
        ref3.current.rotation.z + deltaZ * rotationSpeed;
    } else {
      // (time-based sine curve)
      ref3.current.rotation.x = targetX;
      ref3.current.rotation.y = targetY;
      ref3.current.rotation.z = targetZ;
    }

    ref4.current.rotation.x = -Math.sin(time * SPEED_Y) * AMPLITUDE_Y;
    ref4.current.rotation.y =
      ref4.current.rotation.y - Math.cos(time * SPEED_X) * AMPLITUDE_X_INV;

    ref5.current.rotation.x = -Math.sin(time * SPEED_Y) * AMPLITUDE_Y;
    ref5.current.rotation.y =
      ref5.current.rotation.y + Math.cos(time * SPEED_X) * AMPLITUDE_X_INV;
  });
}
