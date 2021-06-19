import { Html } from "@react-three/drei";
import { fetchYoutubeUrls } from "./useFetchYoutubeUrls";
import ErrorBoundary from "../../../components/ErrorBoundary";
import { useState } from "react";
import { findAdjacentUnoccupiedPositionsTo } from "./youtubesUtils";
import { YoutubePlayer } from "./YoutubePlayer";
import { INITIAL_PLAYER_POSITIONS } from "../../../utils/constants";
import uniqBy from "lodash.uniqby";

export const PLAYER_DIMENSIONS = [2, 1, 0.1];

/** a field of youtubes, walk around to get recommendations based on the current video */
const Youtubes = () => {
  const initialYoutubeId = "aK4JSwhdcdE";
  const initialYoutubeUrl = `https://www.youtube.com/watch?v=${initialYoutubeId}`;

  const [players, setPlayers] = useState(
    INITIAL_PLAYER_POSITIONS.map(
      (position) =>
        ({
          url: initialYoutubeUrl,
          position,
        } as PlayerType)
    )
  );
  const [loadingPlayers, setLoadingPlayers] = useState([] as PlayerType[]);

  // TODO: store urls in LS,
  // TODO: populate adjacent players on click
  const onPlayerClick = async (position: [number, number, number]) => {
    const adjacentUnoccupiedPositions = findAdjacentUnoccupiedPositionsTo(
      position,
      players
    );
    console.log(
      "🌟🚨 ~ onPlayerClick ~ adjacentUnoccupiedPositions.length",
      adjacentUnoccupiedPositions.length
    );

    setLoadingPlayers(
      adjacentUnoccupiedPositions.map((position, idx) => ({
        url: null,
        position,
      }))
    );

    const { youtubeUrls } = await fetchYoutubeUrls({
      numUrlsToFetch: adjacentUnoccupiedPositions.length,
    });

    const adjacentPlayers = adjacentUnoccupiedPositions.map(
      (position, idx) => ({
        url: youtubeUrls[idx],
        position,
      })
    );
    setPlayers([...players, ...adjacentPlayers]);
    setLoadingPlayers([]);
  };

  return (
    <ErrorBoundary component={<Html>❌ Youtubes</Html>}>
      <mesh>
        {uniqBy([...players, ...loadingPlayers], (player) =>
          JSON.stringify(player.position)
        ).map(({ position, url }) => (
          <YoutubePlayer
            key={JSON.stringify(position)}
            {...{ position, url, onClick: () => onPlayerClick(position) }}
          />
        ))}
      </mesh>
    </ErrorBoundary>
  );
};

export type PlayerType = {
  url: string | null;
  position: [number, number, number];
};

export default Youtubes;
