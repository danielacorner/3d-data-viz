import { useQuery } from "react-query";
import { YoutubeResponseType } from "./youtubeResponseExample";
import { getRandomVideoId } from "./youtubesUtils";

const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;

export function useFetchYoutubeUrls({
  enabled,
  numUrlsToFetch,
}: {
  enabled: boolean;
  numUrlsToFetch: number;
}) {
  const relatedToVideoId = "Ks-_Mh1QhMc";

  // https://react-query.tanstack.com/reference/useQuery
  const { isLoading, error, data } = useQuery<YoutubeResponseType, Error>(
    `youtubeUrls-relatedToVideoId-${relatedToVideoId}`,
    () =>
      // relatedToVideoId
      // https://developers.google.com/youtube/v3/docs/search/list
      fetch(
        `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=${numUrlsToFetch}&relatedToVideoId=${relatedToVideoId}&type=video&key=${API_KEY}`
      ).then((res) => res.json()),
    { refetchOnWindowFocus: false, enabled }
  );

  return {
    isLoading,
    error,
    data,
    youtubeUrls: data?.items?.map(
      (item) => `https://www.youtube.com/watch?v=${item.id.videoId}` || []
    ),
    youtubeIds: data?.items?.map((item) => item.id.videoId) || [],
  };
}

export async function fetchYoutubeUrlsRelatedTo({
  numUrlsToFetch,
  relatedToVideoId,
  setError,
}: {
  numUrlsToFetch: number;
  relatedToVideoId: string;
  setError: (error: Error) => void;
}) {
  // relatedToVideoId query
  // https://developers.google.com/youtube/v3/docs/search/list
  return fetch(
    `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=${numUrlsToFetch}&relatedToVideoId=${relatedToVideoId}&type=video&key=${API_KEY}`
  )
    .then((res) => res.json())
    .then((data) => {
      console.log("🌟🚨 ~ .then ~ data", data);
      if (data?.error?.code) {
        setError(data.error);
      }

      return {
        data,
        youtubeUrls:
          data?.items?.map(
            (item) => `https://www.youtube.com/watch?v=${item.id.videoId}`
          ) || [],
        youtubeIds: data?.items?.map((item) => item.id.videoId) || [],
      };
    })
    .catch((err) => {
      console.info(err);
      return { data: null, youtubeUrls: [], youtubeIds: [] };
    });
}

export async function fetchRandomYoutubeUrls(numUrlsToFetch: number) {
  const fakeIds = [...Array(numUrlsToFetch)].map((_, idx) =>
    getRandomVideoId()
  );
  console.log("🌟🚨 ~ fetchRandomYoutubeUrls ~ fakeIds", fakeIds);
  const fakeUrls = fakeIds.map((id) => `https://www.youtube.com/watch?v=${id}`);
  console.log("🌟🚨 ~ fetchRandomYoutubeUrls ~ fakeUrls", fakeUrls);

  // TODO: retry fetching urls until all the ids are valid
  let attemptsRemaining = 20;
  let successes = 0;
  while (attemptsRemaining > 0 && successes < numUrlsToFetch) {
    attemptsRemaining--;
    const response = await fetch(fakeUrls[0])
      .then((resp) => resp.text())
      .catch((err) => {
        console.count(err);
      });
    console.log("🌟🚨 ~ fetchRandomYoutubeUrls ~ response", response);
    const isSuccess = false;
    if (isSuccess) {
      successes++;
    }
  }

  return Promise.resolve({
    data: null,
    youtubeUrls: fakeUrls,
    youtubeIds: fakeIds,
  });
}
