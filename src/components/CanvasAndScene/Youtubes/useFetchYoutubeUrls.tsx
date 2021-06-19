import { useQuery } from "react-query";
import { YoutubeResponseType } from "./youtubeResponseExample";

export function useFetchYoutubeUrls({ enabled }) {
  const relatedToVideoId = "Ks-_Mh1QhMc";

  const apiKey = process.env.REACT_APP_YOUTUBE_API_KEY;

  // https://react-query.tanstack.com/reference/useQuery
  const { isLoading, error, data } = useQuery<YoutubeResponseType, Error>(
    `youtubeUrls-relatedToVideoId-${relatedToVideoId}`,
    () =>
      // relatedToVideoId
      // https://developers.google.com/youtube/v3/docs/search/list
      fetch(
        `https://youtube.googleapis.com/youtube/v3/search?part=snippet&relatedToVideoId=${relatedToVideoId}&type=video&key=${apiKey}`
      ).then((res) => res.json()),
    { refetchOnWindowFocus: false, enabled }
  );

  return {
    isLoading,
    error,
    data,
    youtubeUrls: data?.items.map(
      (item) => `https://www.youtube.com/watch?v=${item.id}`
    ),
  };
}
