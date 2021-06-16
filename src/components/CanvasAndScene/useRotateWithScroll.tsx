import { useEffect, useState } from "react";
import { useAnimationStep } from "../store/store";
import { INITIAL_ROTATION, ROTATION_STEPS } from "../../utils/constants";
import isEqual from "lodash.isequal";
// import * as THREE from "three";
// const degToRad = THREE.Math.degToRad;

export function useRotateWithScroll() {
  // const x = useControl("xxx", {
  //   type: "number",
  //   min: 0,
  //   max: 360,
  //   value: 235.2,
  // });
  // const y = useControl("yyy", {
  //   type: "number",
  //   min: 0,
  //   max: 360,
  //   value: 304.8,
  // });
  // const z = useControl("zzz", {
  //   type: "number",
  //   min: 0,
  //   max: 360,
  //   value: 152.4,
  // });

  const animationStep = useAnimationStep();

  const [rotation, setRotation] = useState(ROTATION_STEPS[0]);
  useEffect(() => {
    const rotationStep = animationStep - 2; // starting position
    const rotation = ROTATION_STEPS[rotationStep] || INITIAL_ROTATION;

    if (isEqual(rotation, INITIAL_ROTATION)) {
      return;
      // setRotation()
      // } else if (isEqual(rotation, STEP11_RAD)) {
      //   setRotation({ x: degToRad(x), y: degToRad(y), z: degToRad(z) });
    } else {
      setRotation(rotation);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animationStep /* , x, y, z */]);

  return rotation as { x: number; y: number; z: number };
}
