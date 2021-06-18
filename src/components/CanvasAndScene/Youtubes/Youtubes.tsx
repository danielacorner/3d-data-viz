import { Billboard, Html } from "@react-three/drei";
import ReactPlayer from "react-player";
import { CAMERA_DISTANCE_FROM_PLAYER } from "../../../utils/constants";
import { useAnimateCameraPositionTo } from "../../../utils/useAnimateCameraPositionTo";

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
        <YoutubePlayer key={JSON.stringify(position)} {...{ position, url }} />
      ))}
    </mesh>
  );
};

export default Youtubes;

const PLAYER_SCALE = 0.2;

function YoutubePlayer({
  position,
  url,
}: {
  position: [number, number, number];
  url: string;
}) {
  const { animateCameraPositionTo } = useAnimateCameraPositionTo(position);

  const viewingPosition = [
    position[0],
    position[1],
    position[2] + CAMERA_DISTANCE_FROM_PLAYER,
  ];

  const handleAnimateToViewingPosition = () => {
    // setLookAtTarget(position);
    animateCameraPositionTo(viewingPosition);
  };

  return (
    <Billboard position={position} {...({} as any)}>
      <boxBufferGeometry args={PLAYER_DIMENSIONS} />
      <meshBasicMaterial color="white" />
      {/* https://github.com/pmndrs/drei#html */}
      <Html
        className="react-player-wrapper"
        transform={true}
        sprite={false}
        style={{
          width: 530 * PLAYER_SCALE,
          height: 300 * PLAYER_SCALE,
        }}
      >
        {/* TODO: only show one player at a time, the rest are preview images */}
        {/* https://www.npmjs.com/package/react-player */}
        <ReactPlayer
          onClickPreview={handleAnimateToViewingPosition}
          width={530}
          height={300}
          style={{
            transform: `scale(${PLAYER_SCALE})`,
            transformOrigin: "top left",
          }}
          // playing={isPlaying}
          light={true}
          url={url}
        />
      </Html>
    </Billboard>
  );
}

// dome = cube with 9 on each side (9+9+8=26 total)
const SIDE_DISTANCE = 10;
const sidesZ = [
  SIDE_DISTANCE, // front (towards you)
  0, // center
  -SIDE_DISTANCE, // back (towards the screen)
];
const RELATIVE_DOME_POSITIONS = sidesZ.reduce(
  (acc, s) => [
    ...acc,
    ...(s === sidesZ[0] ? [] : [[0, 0, s]]), // center
    [SIDE_DISTANCE, 0, s], // right
    [-SIDE_DISTANCE, 0, s], // left
    [0, SIDE_DISTANCE, s], // top
    [0, -SIDE_DISTANCE, s], // bottom
    // [SIDE_DISTANCE, SIDE_DISTANCE, s], // top right
    // [-SIDE_DISTANCE, SIDE_DISTANCE, s], // top left
    // [SIDE_DISTANCE, -SIDE_DISTANCE, s], // bottom right
    // [-SIDE_DISTANCE, -SIDE_DISTANCE, s], // bottom left
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
