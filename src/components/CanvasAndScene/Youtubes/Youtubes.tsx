import { Html } from "@react-three/drei";
import { fetchYoutubeUrlsRelatedTo } from "./useFetchYoutubeUrls";
import ErrorBoundary from "../../../components/ErrorBoundary";
import { useEffect, useState } from "react";
import { findAdjacentUnoccupiedPositionsTo } from "./youtubesUtils";
import { YoutubePlayer } from "./YoutubePlayer";
import {
  INITIAL_PLAYER_POSITION,
  INITIAL_PLAYER_POSITIONS,
  INITIAL_YOUTUBE_ID,
  INITIAL_YOUTUBE_URL,
} from "../../../utils/constants";
import { useMount } from "../../../utils/hooks";
import { PreviousPositionsIndicator } from "./PreviousPositionsIndicator";
import { useAtom } from "jotai";
import {
  errorAtom,
  playersAtom,
  positionsHistoryAtom,
} from "../../../store/store";
import isEqual from "lodash.isequal";
import uniqBy from "lodash.uniqby";
import CannotFetchDataIndicator from "./CannotFetchDataIndicator";

export const PLAYER_DIMENSIONS = [2, 1, 0.1];

// TODO: handle 403 error by populating with fake data? dev mode only?

/** a field of youtubes, walk around to get recommendations based on the current video */
const Youtubes = ({ initialYoutubeId }: { initialYoutubeId: string }) => {
  const cannotFetchData = useIs403Error();

  const [, setError] = useAtom(errorAtom);
  const [players, setPlayers] = useAtom(playersAtom); // playersAtom saves to LS

  // start with dome of loading players around center player
  const [loadingPlayers, setLoadingPlayers] = useState<PlayerType[]>(
    INITIAL_PLAYER_POSITIONS.filter(
      (p) => JSON.stringify(p) !== JSON.stringify(INITIAL_PLAYER_POSITION)
    ).map((position) => ({
      url: null,
      videoId: null,
      position,
    }))
  );

  // on mount, fetch videos related to initialYoutubeId
  useMount(() => {
    // skip if we already have some videos from LS
    if (players.length > 1 || cannotFetchData) {
      return;
    }
    (async () => {
      const { youtubeUrls, youtubeIds, data } = await fetchYoutubeUrlsRelatedTo(
        {
          numUrlsToFetch: loadingPlayers.length,
          relatedToVideoId: initialYoutubeId,
          setError,
        }
      );
      const errorCode = data?.error?.code;
      if (errorCode) {
        console.log("🌟🚨🚨🚨🚨🚨🚨 ~ data?.error?.code", data?.error?.code);
        return;
      }
      const adjacentPlayers = loadingPlayers.map(({ position }, idx) => ({
        url: youtubeUrls[idx],
        videoId: youtubeIds[idx],
        position,
      }));
      setLoadingPlayers([]);
      setPlayers([...players, ...adjacentPlayers]);
    })();
  });

  // when we get error 403 (cannotFetchData) for the first time, refetch fake players
  // ! doesn't work - getRandomVideoId unlikely to be valid
  // useEffect(() => {
  //   const numUrlsToFetch = loadingPlayers.length;
  //   if (cannotFetchData && numUrlsToFetch > 0) {
  //     (async () => {
  //       const { youtubeUrls, youtubeIds } = await fetchRandomYoutubeUrls(
  //         numUrlsToFetch
  //       );
  //       const adjacentPlayers = loadingPlayers.map(({ position }, idx) => ({
  //         url: youtubeUrls[idx],
  //         videoId: youtubeIds[idx],
  //         position,
  //       }));
  //       setLoadingPlayers([]);
  //       setPlayers([...players, ...adjacentPlayers]);
  //     })();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [cannotFetchData, loadingPlayers]);

  // when we get error 403 (cannotFetchData) for the first time, set all players to show the same video
  useEffect(() => {
    if (cannotFetchData && loadingPlayers.length > 0) {
      const adjacentPlayers = loadingPlayers.map(({ position }, idx) => ({
        url: "https://" + INITIAL_YOUTUBE_URL,
        videoId: INITIAL_YOUTUBE_ID,
        position,
      }));
      setLoadingPlayers([]);
      setPlayers([...players, ...adjacentPlayers]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cannotFetchData, loadingPlayers]);

  const [positionsHistory, setPositionsHistory] = useAtom(positionsHistoryAtom);

  const [isPlaying, setIsPlaying] = useState(false);

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
      setError,
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

    // start this player on click
    setIsPlaying(true);
  };

  return (
    <ErrorBoundary component={<Html>❌ Youtubes</Html>}>
      <mesh>
        {uniqBy([...players, ...loadingPlayers], (player) =>
          JSON.stringify(player.position)
        ).map(({ position, url, videoId }) => {
          const isCurrentPosition = isEqual(
            position,
            positionsHistory[positionsHistory.length - 1]
          );
          return (
            <YoutubePlayer
              key={JSON.stringify(position)}
              {...{
                position,
                // stop other players playing when we click a player
                isPlaying: isPlaying && isCurrentPosition,
                url,
                ...(videoId
                  ? { onClick: () => onPlayerClick(position, videoId) }
                  : {}),
              }}
            />
          );
        })}
      </mesh>
      <PreviousPositionsIndicator />
      {cannotFetchData && <CannotFetchDataIndicator />}
    </ErrorBoundary>
  );
};

/** when clicking to a different player, stop all players (then we can click the video again to play it) */
// function useRerenderOnPositionChange() {
//   const [rerenderKey, setRerenderKey] = useState(Math.random());

//   const [positionsHistory] = useAtom(positionsHistoryAtom);
//   // when we click to a new position, stop all players
//   useEffect(() => {
//     setRerenderKey(Math.random());
//   }, [positionsHistory]);

//   return rerenderKey;
// }

export type PlayerType = {
  url: string | null;
  videoId: string | null;
  position: [number, number, number];
};

export default Youtubes;

function useIs403Error() {
  const [error] = useAtom(errorAtom);
  return (error as any)?.code && (error as any).code === 403;
}
