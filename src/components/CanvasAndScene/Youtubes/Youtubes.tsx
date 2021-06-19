import { Html } from "@react-three/drei";
import { useFetchYoutubeUrls } from "./useFetchYoutubeUrls";
import ErrorBoundary from "../../../components/ErrorBoundary";
import { useState } from "react";
import { findAdjacentUnoccupiedPositionsTo } from "./youtubesUtils";
import { YoutubePlayer } from "./YoutubePlayer";
import { INITIAL_PLAYER_POSITIONS } from "../../../utils/constants";
import uniqBy from "lodash.uniqby";

export const PLAYER_DIMENSIONS = [2, 1, 0.1];

/** a field of youtubes, walk around to get recommendations based on the current video */
const Youtubes = () => {
  const [players, setPlayers] = useState(
    INITIAL_PLAYER_POSITIONS.map(
      (position) =>
        ({
          url: "https://www.youtube.com/watch?v=aK4JSwhdcdE",
          position,
        } as PlayerType)
    )
  );

  const enabled = true;
  const { data, isLoading, error, youtubeUrls } = useFetchYoutubeUrls({
    enabled,
  });
  console.log("🌟🚨 ~ useFetchYoutubeUrls ~ { isLoading, error, data }", {
    isLoading,
    error,
    data,
    youtubeUrls,
  });

  // TODO: store urls in LS,
  // TODO: populate adjacent players on click
  const onPlayerClick = (position: [number, number, number]) => {
    const adjacentUnoccupiedPositions = findAdjacentUnoccupiedPositionsTo(
      position,
      players
    );
    const adjacentPlayers = adjacentUnoccupiedPositions.map((position) => ({
      url: "TODO",
      position,
    }));
    setPlayers([...players, ...adjacentPlayers]);
  };

  return (
    <ErrorBoundary component={<Html>❌ Youtubes</Html>}>
      <mesh>
        {uniqBy(players, (player) => JSON.stringify(player.position)).map(
          ({ position, url }) => (
            <YoutubePlayer
              key={JSON.stringify(position)}
              {...{ position, url, onClick: () => onPlayerClick(position) }}
            />
          )
        )}
      </mesh>
    </ErrorBoundary>
  );
};

export type PlayerType = {
  url: string;
  position: [number, number, number];
};

export default Youtubes;
