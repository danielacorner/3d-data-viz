import { Line, Text } from "@react-three/drei";
import { useAtom } from "jotai";
import { positionsHistoryAtom } from "../../../store/store";

/** save a trail of previous positions */
export function PreviousPositionsIndicator() {
  const [positionsHistory] = useAtom(positionsHistoryAtom);
  console.log(
    "🌟🚨 ~ PreviousPositionsIndicator ~ positionsHistory",
    positionsHistory
  );

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
