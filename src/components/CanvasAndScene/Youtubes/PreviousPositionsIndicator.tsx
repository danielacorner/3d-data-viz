import { Line, Text } from "@react-three/drei";

/** save a trail of previous positions */
export function PreviousPositionsIndicator({
  positionsHistory,
}: {
  positionsHistory: [number, number, number][];
}) {
  return (
    <mesh>
      <Line color={"white"} points={positionsHistory} />;
      {positionsHistory.map((position, idx) => (
        <Text
          key={idx}
          position={[position[0], position[1] + 1.5, position[2]]}
          color="white"
          fontSize={1}
          {...({} as any)}
        >
          {idx + 1}
        </Text>
      ))}
    </mesh>
  );
}
