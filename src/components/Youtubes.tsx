import { Center, Html } from "@react-three/drei";
import { useState } from "react";
import ReactPlayer from "react-player";

const PLAYER_DIMENSIONS = [2, 1, 0.1];

/** a field of youtubes, walk around to get recommendations based on the current video */
const Youtubes = () => {
  const playerPositions: [number, number, number][] = [
    [0, 0, 0],
    [0, 0, 1],
    [0, 0, 2],
  ];
  return (
    <mesh>
      {playerPositions.map((pos) => (
        <Player position={pos} />
      ))}
    </mesh>
  );
};

export default Youtubes;

function Player({ position }: { position: [number, number, number] }) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <Center position={position} {...({} as any)}>
      <mesh>
        <boxBufferGeometry args={PLAYER_DIMENSIONS} />
        <meshBasicMaterial color="white" />

        <Html>
          <ReactPlayer
            playing={isPlaying}
            url="https://www.youtube.com/watch?v=aK4JSwhdcdE"
          />
        </Html>
      </mesh>
    </Center>
  );
}
