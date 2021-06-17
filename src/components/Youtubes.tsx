import React from "react";

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
      {playerPositions.map(([x, y, z]) => (
        <mesh>
          <boxBufferGeometry args={PLAYER_DIMENSIONS} />
          <meshBasicMaterial color="white" />
        </mesh>
      ))}
    </mesh>
  );
};

export default Youtubes;
