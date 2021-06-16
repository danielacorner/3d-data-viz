import { useControl } from "react-three-gui";

export default function RGBLights() {
  const MULT = useControl("MULT", {
    type: "number",
    min: -1,
    max: 1,
    value: 0,
  });
  return (
    <>
      <pointLight
        decay={0}
        distance={0}
        intensity={1 * MULT}
        color="lightblue"
        castShadow={true}
        position={[-2, -8, 5]}
      />
      <pointLight
        decay={0}
        distance={0}
        intensity={3 * MULT}
        color="red"
        castShadow={true}
        position={[1, 8, -5]}
      />
      <pointLight
        decay={0}
        distance={0}
        intensity={2 * MULT}
        color="limegreen"
        castShadow={true}
        position={[3, -8, -6]}
      />
    </>
  );
}
