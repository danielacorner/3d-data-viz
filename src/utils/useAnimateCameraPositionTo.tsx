import { useThree } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { useSpring } from "@react-spring/three";
import isEqual from "lodash.isequal";
import { usePrevious } from "./hooks";
import { useAtom } from "jotai";
import { isCameraAnimatingAtom, lookAtTargetAtom } from "../store/store";
import { CAMERA_DISTANCE_FROM_PLAYER } from "./constants";

export function useAnimateCameraPositionTo(
  lookAtPosition: [number, number, number]
) {
  // look at this element during animation

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

  const prevCameraPosition = usePrevious(nextCameraPosition);

  // start the animation
  useEffect(() => {
    const isFirstTime = isEqual(cameraPositionArr, nextCameraPosition);
    if (!isFirstTime) {
      setIsCameraAnimating(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextCameraPosition]);

  // change the OrbitControls target on click
  useEffect(() => {
    if (isCameraAnimating && lookAtPosition) {
      camera.lookAt(...lookAtPosition);
    }
  }, [camera, isCameraAnimating, lookAtPosition]);

  const [, setLookAtTarget] = useAtom(lookAtTargetAtom);

  // allow user to set a callback after animation ends
  const [afterAnimationCallbackFn, setAfterAnimationCallback] =
    useState<Function | null>(null);

  useSpring({
    from: {
      camPosition: prevCameraPosition,
    },
    to: {
      camPosition: nextCameraPosition,
    },
    config: { mass: 1, tension: 100, friction: 20, clamp: false },
    onRest: () => {
      // stop the animation
      setIsCameraAnimating(false);
      if (afterAnimationCallbackFn) {
        // fire each callback once, after the animation finishes
        afterAnimationCallbackFn();
        setAfterAnimationCallback(null);
      }
    },
    onChange: ({ value: { camPosition } }) => {
      if (isCameraAnimating) {
        camera.position.set(...camPosition);
        setLookAtTarget([
          camPosition[0],
          camPosition[1],
          camPosition[2] - CAMERA_DISTANCE_FROM_PLAYER,
        ]);
      }
    },
  });

  return {
    animateCameraPositionTo: ({
      position: newPos,
      afterAnimationCallbackFn: callback,
    }: {
      position: [number, number, number];
      afterAnimationCallbackFn?: Function;
    }) => {
      setNextCameraPosition(newPos);
      if (callback) {
        setAfterAnimationCallback(callback);
      }
    },
  };
}
