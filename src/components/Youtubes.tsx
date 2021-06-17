import { Billboard, Html } from "@react-three/drei";
import ReactPlayer from "react-player";

const PLAYER_DIMENSIONS = [2, 1, 0.1];

/** a field of youtubes, walk around to get recommendations based on the current video */
const Youtubes = () => {
  const playerPositions: [number, number, number][] = getDomeOfPositionsAround([
    0, 0, 0,
  ]);
  const players = playerPositions.map((position) => ({
    url: "https://www.youtube.com/watch?v=aK4JSwhdcdE",
    position,
  }));

  return (
    <mesh>
      {players.map(({ position, url }) => (
        <Player {...{ position, url }} />
      ))}
    </mesh>
  );
};

export default Youtubes;

function Player({
  position,
  url,
}: {
  position: [number, number, number];
  url: string;
}) {
  // const [isPlaying, setIsPlaying] = useState(false);
  return (
    <Billboard position={position} {...({} as any)}>
      <boxBufferGeometry args={PLAYER_DIMENSIONS} />
      <meshBasicMaterial color="white" />

      {/* https://github.com/pmndrs/drei#html */}
      <Html className="react-player-wrapper" transform={true} sprite={false}>
        <ReactPlayer
          width={530}
          height={300}
          style={{ transform: "scale(0.2)" }}
          // playing={isPlaying}
          url={url}
        />
      </Html>
    </Billboard>
  );
}

// dome = cube with 9 on each side (9+9+8=26 total)
const SIDE_DISTANCE = 10;
const sidesZ = [
  SIDE_DISTANCE, // back
  0, // center
  -SIDE_DISTANCE, // front
];
const RELATIVE_DOME_POSITIONS = sidesZ.reduce(
  (acc, s) => [
    ...acc,
    [0, 0, s], // center
    [SIDE_DISTANCE, 0, s], // right
    [-SIDE_DISTANCE, 0, s], // left
    [0, SIDE_DISTANCE, s], // top
    [0, -SIDE_DISTANCE, s], // bottom
    // [d, d, s], // top right
    // [-d, d, s], // top left
    // [d, -d, s], // bottom right
    // [-d, -d, s], // bottom left
  ],
  [] as number[][]
);
function getDomeOfPositionsAround(position: [number, number, number]) {
  const [px, py, pz] = position;
  return RELATIVE_DOME_POSITIONS.map(([dx, dy, dz]) => [
    px + dx,
    py + dy,
    pz + dz,
  ]) as [number, number, number][];
}
