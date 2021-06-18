import { useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { useSpring } from "@react-spring/three";
import isEqual from "lodash.isequal";
import { usePrevious } from "./hooks";
import { useAtom } from "jotai";
import { isCameraAnimatingAtom, lookAtTargetAtom } from "../store/store";

export function useAnimateCameraPositionTo() {
  // look at this element during animation
  const lookAtRef = useRef(null as any);

  const { camera } = useThree();
  const cameraPositionArr: [number, number, number] = [
    camera.position.x,
    camera.position.y,
    camera.position.z,
  ];
  const [nextCameraPosition, setNextCameraPosition] =
    useState<[number, number, number]>(cameraPositionArr);
  const [isCameraAnimating, setIsCameraAnimating] = useAtom(
    isCameraAnimatingAtom
  );
  const [, setLookAtTarget] = useAtom(lookAtTargetAtom);

  const prevCameraPosition = usePrevious(nextCameraPosition);

  // start the animation
  useEffect(() => {
    const isFirstTime = isEqual(cameraPositionArr, nextCameraPosition);
    if (!isFirstTime) {
      setIsCameraAnimating(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextCameraPosition]);

  useSpring({
    from: {
      position: prevCameraPosition,
    },
    to: {
      position: nextCameraPosition,
    },
    config: { mass: 10, tension: 100, friction: 20, clamp: true },
    onRest: () => {
      // stop the animation
      setIsCameraAnimating(false);
    },
    onChange: ({ value: { position } }) => {
      if (isCameraAnimating) {
        camera.position.set(...position);

        const pos = lookAtRef.current?.position;
        if (pos) {
          const newLookAtTarget = [pos.x, pos.y, pos.z] as [
            number,
            number,
            number
          ];
          setLookAtTarget(newLookAtTarget);
        }
      }
    },
  });

  return {
    animateCameraPositionTo: (newPos) => setNextCameraPosition(newPos),
    lookAtRef,
  };
}
