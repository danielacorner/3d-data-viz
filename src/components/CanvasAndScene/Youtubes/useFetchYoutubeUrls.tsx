import { useQuery } from "react-query";
import { YoutubeResponseType } from "./youtubeResponseExample";

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

export function fetchYoutubeUrlsRelatedTo({
  numUrlsToFetch,
  relatedToVideoId,
}: {
  numUrlsToFetch: number;
  relatedToVideoId: string;
}) {
  // relatedToVideoId query
  // https://developers.google.com/youtube/v3/docs/search/list
  return fetch(
    `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=${numUrlsToFetch}&relatedToVideoId=${relatedToVideoId}&type=video&key=${API_KEY}`
  )
    .then((res) => res.json())
    .then((data) => ({
      data,
      youtubeUrls: data?.items.map(
        (item) => `https://www.youtube.com/watch?v=${item.id.videoId}`
      ),
      youtubeIds: data?.items.map((item) => item.id.videoId),
    }))
    .catch((err) => {
      console.info(err);
      return { youtubeUrls: [], youtubeIds: [] };
    });
}
