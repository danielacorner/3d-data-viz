import { Line } from "@react-three/drei";

/** save a trail of previous positions */
export function PreviousPositionsIndicator({
  positionsHistory,
}: {
  positionsHistory: [number, number, number][];
}) {
  return <Line color={"white"} points={positionsHistory} />;
}
