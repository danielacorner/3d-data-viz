import { Html } from "@react-three/drei";
import {
  fetchRandomYoutubeUrls,
  fetchYoutubeUrlsRelatedTo,
} from "./useFetchYoutubeUrls";
import ErrorBoundary from "../../../components/ErrorBoundary";
import { useEffect, useState } from "react";
import { findAdjacentUnoccupiedPositionsTo } from "./youtubesUtils";
import { YoutubePlayer } from "./YoutubePlayer";
import {
  INITIAL_PLAYER_POSITION,
  INITIAL_PLAYER_POSITIONS,
} from "../../../utils/constants";
import { useMount } from "../../../utils/hooks";
import { PreviousPositionsIndicator } from "./PreviousPositionsIndicator";
import { useAtom } from "jotai";
import { errorAtom, playersAtom } from "../../../store/store";

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
      const numUrlsToFetch = loadingPlayers.length;
      const { youtubeUrls, youtubeIds, data } = await fetchYoutubeUrlsRelatedTo(
        {
          numUrlsToFetch,
          relatedToVideoId: initialYoutubeId,
          setError,
        }
      );
      const errorCode = data?.error?.code;
      if (errorCode) {
        console.log("🌟🚨🚨🚨🚨🚨🚨 ~ data?.error?.code", data?.error?.code);
        return;
      }
      console.log("🌟🚨 ~ youtubeUrls", youtubeUrls);
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
  useEffect(() => {
    const numUrlsToFetch = loadingPlayers.length;
    console.log("🌟🚨 ~ useEffect ~ cannotFetchData", cannotFetchData);
    console.log("🌟🚨 ~ useEffect ~ numUrlsToFetch", numUrlsToFetch);
    if (cannotFetchData && numUrlsToFetch > 0) {
      (async () => {
        const { youtubeUrls, youtubeIds } = await fetchRandomYoutubeUrls(
          numUrlsToFetch
        );
        console.log("🌟🚨🌟🚨🌟🚨 ~ youtubeUrls", youtubeUrls);
        const adjacentPlayers = loadingPlayers.map(({ position }, idx) => ({
          url: youtubeUrls[idx],
          videoId: youtubeIds[idx],
          position,
        }));
        setLoadingPlayers([]);
        setPlayers([...players, ...adjacentPlayers]);
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cannotFetchData, loadingPlayers]);

  const [positionsHistory, setPositionsHistory] = useState<
    [number, number, number][]
  >([INITIAL_PLAYER_POSITION]);

  // TODO: stop other players playing when we click a player
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
      {/* // TODO: add text indicating current & nearby video details  */}
    </ErrorBoundary>
  );
};

export type PlayerType = {
  url: string | null;
  videoId: string | null;
  position: [number, number, number];
};

export default Youtubes;

function useIs403Error() {
  const [error] = useAtom(errorAtom);
  console.log("🌟🚨 ~ useIs403Error ~ error", error);
  return (error as any)?.code && (error as any).code === 403;
}
