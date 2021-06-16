import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useIsSpinning } from "./store/store";

// const SPEED_X = 0.2;
const SPEED_Y = 0.1;
const AMPLITUDE_Y = 0.2;
// const AMPLITUDE_X = 0.7;
const ANIMATION_SPEED = 0.07; // 0 to 1, 0 nothing 1 instant
export default function SpinScene({ children }) {
  const isSpinning = useIsSpinning();
  const ref = useRef(null as any);
  useFrame(({ clock }) => {
    if (!isSpinning) {
      // animate the rotation back to 0
      ref.current.rotation.x = ref.current.rotation.x * (1 - ANIMATION_SPEED);
      ref.current.rotation.y = ref.current.rotation.y * (1 - ANIMATION_SPEED);
      ref.current.rotation.z = ref.current.rotation.z * (1 - ANIMATION_SPEED);
      return;
    }
    const time = clock.getElapsedTime();
    if (ref.current) {
      // speed up the rotation from 0
      const target = {
        x: -Math.sin(time * SPEED_Y) * AMPLITUDE_Y,
        y: ref.current.rotation.y + 0.0015,
      };
      const delta = {
        x: target.x - ref.current.rotation.x,
        y: target.y - ref.current.rotation.y,
      };
      ref.current.rotation.x = target.x - delta.x * 0.1;
      ref.current.rotation.y = target.y - delta.y * 0.1;
    }
  });
  return <mesh ref={ref}>{children}</mesh>;
}
