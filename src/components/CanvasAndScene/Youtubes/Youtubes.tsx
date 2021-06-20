import { Html } from "@react-three/drei";
import { fetchYoutubeUrlsRelatedTo } from "./useFetchYoutubeUrls";
import ErrorBoundary from "../../../components/ErrorBoundary";
import { useMemo, useState } from "react";
import { findAdjacentUnoccupiedPositionsTo } from "./youtubesUtils";
import { YoutubePlayer } from "./YoutubePlayer";
import { INITIAL_PLAYER_POSITIONS } from "../../../utils/constants";
import { useMount } from "../../../utils/hooks";
import * as THREE from "three";

const INITIAL_POSITION: [number, number, number] = [0, 0, 0];
export const PLAYER_DIMENSIONS = [2, 1, 0.1];

/** a field of youtubes, walk around to get recommendations based on the current video */
const Youtubes = ({ initialYoutubeId }: { initialYoutubeId: string }) => {
  const initialYoutubeUrl = `https://www.youtube.com/watch?v=${initialYoutubeId}`;

  // start with a single loaded player
  const [players, setPlayers] = useState<PlayerType[]>([
    {
      url: initialYoutubeUrl,
      videoId: initialYoutubeId,
      position: INITIAL_POSITION,
    },
  ]);
  // start with dome of loading players around center player
  const [loadingPlayers, setLoadingPlayers] = useState<PlayerType[]>(
    INITIAL_PLAYER_POSITIONS.filter(
      (p) => JSON.stringify(p) !== JSON.stringify(INITIAL_POSITION)
    ).map((position) => ({
      url: null,
      videoId: null,
      position,
    }))
  );

  // on mount, fetch videos related to initialYoutubeId
  useMount(() => {
    (async () => {
      const { youtubeUrls, youtubeIds } = await fetchYoutubeUrlsRelatedTo({
        numUrlsToFetch: loadingPlayers.length,
        relatedToVideoId: initialYoutubeId,
      });
      const adjacentPlayers = loadingPlayers.map(({ position }, idx) => ({
        url: youtubeUrls[idx],
        videoId: youtubeIds[idx],
        position,
      }));
      setLoadingPlayers([]);
      setPlayers([...players, ...adjacentPlayers]);
    })();
  });

  const [positionsHistory, setPositionsHistory] = useState<
    [number, number, number][]
  >([INITIAL_POSITION]);

  // TODO: store urls in LS,
  // on click, populate adjacent players with video urls
  const onPlayerClick = async (
    position: [number, number, number],
    videoId: string
  ) => {
    setPositionsHistory((prev) => [...prev, position]);

    const adjacentUnoccupiedPositions = findAdjacentUnoccupiedPositionsTo(
      position,
      players
    );

    setLoadingPlayers(
      adjacentUnoccupiedPositions.map((position, idx) => ({
        url: null,
        videoId: null,
        position,
      }))
    );

    const { youtubeUrls, youtubeIds } = await fetchYoutubeUrlsRelatedTo({
      numUrlsToFetch: adjacentUnoccupiedPositions.length,
      relatedToVideoId: videoId,
    });

    const adjacentPlayers = adjacentUnoccupiedPositions.map(
      (position, idx) => ({
        url: youtubeUrls[idx],
        videoId: youtubeIds[idx],
        position,
      })
    );
    setLoadingPlayers([]);
    setPlayers([...players, ...adjacentPlayers]);
  };

  return (
    <ErrorBoundary component={<Html>❌ Youtubes</Html>}>
      <mesh>
        {[...players, ...loadingPlayers]
          // uniqBy([...players, ...loadingPlayers], (player) =>
          //   JSON.stringify(player.position)
          // )
          .map(({ position, url, videoId }) => (
            <YoutubePlayer
              key={JSON.stringify(position)}
              {...{
                position,
                url,
                ...(videoId
                  ? { onClick: () => onPlayerClick(position, videoId) }
                  : {}),
              }}
            />
          ))}
      </mesh>
      <PreviousPositionsIndicator {...{ positionsHistory }} />
    </ErrorBoundary>
  );
};

export type PlayerType = {
  url: string | null;
  videoId: string | null;
  position: [number, number, number];
};

export default Youtubes;

// TODO: save a trail of previous positions
function PreviousPositionsIndicator({
  positionsHistory,
}: {
  positionsHistory: [number, number, number][];
}) {
  return (
    <>
      {positionsHistory.map((position, idx) => {
        const prevPosition = positionsHistory[idx - 1];
        return (
          <mesh
            key={idx}
            position={[position[0], position[1] + 1.2, position[2]]}
          >
            {/* ball indicator */}

            <mesh renderOrder={10}>
              <sphereBufferGeometry args={[0.2]} />
              <meshBasicMaterial />
            </mesh>
            {/* line leading to previous ball */}
            {prevPosition ? <Line start={position} end={prevPosition} /> : null}
          </mesh>
        );
      })}
    </>
  );
}

// https://www.tabnine.com/code/javascript/classes/react-three-fiber/lineBasicMaterial
function Line({ start, end }) {
  const points = useMemo(
    () => [start, end].map((v) => new THREE.Vector3(...v)),
    [start, end]
  );

  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

  return (
    <mesh geometry={lineGeometry}>
      <lineBasicMaterial attach="material" color="white" linewidth={2} />
    </mesh>
  );
}
