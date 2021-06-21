import { Line, Text } from "@react-three/drei";
import { useAtom } from "jotai";
import { positionsHistoryAtom, titleDisplayAtom } from "../../../store/store";
import { useCurrentPosition } from "./youtubesUtils";

/** save a trail of previous positions */
export function PreviousPositionsIndicator() {
  const [positionsHistory] = useAtom(positionsHistoryAtom);
  const [titleDisplay] = useAtom(titleDisplayAtom);

  const currentPosition = useCurrentPosition();

  return (
    <mesh>
      {/* line across previous positions */}
      <Line color={"white"} points={positionsHistory} />;
      {/* text above current position */}
      <Text
        position={[
          currentPosition[0],
          currentPosition[1] + 1.1,
          currentPosition[2],
        ]}
        fontSize={0.14}
        color={"#FFFFFF"}
        maxWidth={3}
        alignX="center"
        textAlign="center"
        lineHeight={1.2}
        letterSpacing={0.02}
        anchorX="center"
        anchorY="middle"
        outlineOffsetX={"10%"}
        outlineOffsetY={"10%"}
        outlineBlur={"30%"}
        outlineOpacity={0.3}
        outlineColor="#EC2D2D"
        {...({} as any)}
      >
        {titleDisplay}
      </Text>
    </mesh>
  );
}
