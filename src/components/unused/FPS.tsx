import React, { useRef, useMemo, useEffect } from "react";
import { useFrame, addTail, useThree } from "@react-three/fiber";
import throttle from "lodash.throttle";
import { Html } from "@react-three/drei";

export default function Fps() {
  let ref = useRef(null as any);
  let last = Date.now();
  const fn = useMemo(
    () =>
      throttle((fps) => (ref.current.innerText = "fps " + fps.toFixed(0)), 60),
    []
  );
  useFrame(() => {
    let now = Date.now();
    fn(1 / ((now - last) / 1000));
    last = now;
  });
  useEffect(() => addTail(() => fn(0)), []);
  const { viewport } = useThree();
  return (
    <Html
      position={[-viewport.width / 2, viewport.height / 2, 0]}
      className="fps"
      ref={ref}
    />
  );
}
