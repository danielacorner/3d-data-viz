import { Html } from "@react-three/drei";
import ReactPlayer from "react-player";

const PLAYER_DIMENSIONS = [2, 1, 0.1];

/** a field of youtubes, walk around to get recommendations based on the current video */
const Youtubes = () => {
  const playerPositions: [number, number, number][] = [
    [0, 0, 0],
    [0, 0, 1],
    [0, 0, 2],
  ];
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
    <mesh position={position}>
      <boxBufferGeometry args={PLAYER_DIMENSIONS} />
      <meshBasicMaterial color="white" />

      {/* https://github.com/pmndrs/drei#html */}
      <Html className="react-player-wrapper" transform={true} sprite={false}>
        <ReactPlayer
          // playing={isPlaying}
          url={url}
        />
      </Html>
    </mesh>
  );
}

// function useDisablePointerEventsWhileScrolling() {
//   const ref = useRef(null as any);
//   const timerRef = useRef(null as number | null);

//   useEventListener("scroll", function () {
//     if (!ref.current) {
//       return;
//     }

//     if (timerRef.current) {
//       window.clearTimeout(timerRef.current);
//     }

//     if (!ref.current.classList.contains(DISABLE_HOVER_CLASS)) {
//       ref.current.classList.add(DISABLE_HOVER_CLASS);
//     }

//     timerRef.current = window.setTimeout(function () {
//       ref.current.classList.remove(DISABLE_HOVER_CLASS);
//     }, 500);
//   });

//   return ref;
// }
