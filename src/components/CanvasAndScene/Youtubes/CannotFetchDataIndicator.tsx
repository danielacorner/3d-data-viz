import { Text } from "@react-three/drei";
import { useCurrentPosition } from "./youtubesUtils";

const CannotFetchDataIndicator = () => {
  const currentPosition = useCurrentPosition();
  return (
    <Text
      {...({} as any)}
      position={[
        currentPosition[0],
        currentPosition[1] - 1,
        currentPosition[2],
      ]}
      color={"orange"}
    >
      (YouTube API daily quota limit exceeded — try again tomorrow)
    </Text>
  );
};

export default CannotFetchDataIndicator;
