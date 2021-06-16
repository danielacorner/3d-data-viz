import { usePlane } from "@react-three/cannon";

export default function Plane({ children = null, ...rest }) {
  const [ref] = usePlane(() => ({
    // rotation: [-Math.PI / 2, 0, 0],
    ...rest,
    // position: [-100, -100, -100],
  }));

  return <mesh ref={ref}>{children}</mesh>;
}
