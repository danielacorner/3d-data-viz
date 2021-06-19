import { useQuery } from "react-query";
import { YOUTUBE_RESPONSE_EXAMPLE } from "./youtubeResponseExample";

type YoutubeApiResponse = typeof YOUTUBE_RESPONSE_EXAMPLE; // TODO

export function useFetchYoutubeUrls({ enabled }) {
  const relatedToVideoId = "Ks-_Mh1QhMc";

  // https://react-query.tanstack.com/reference/useQuery
  const { isLoading, error, data } = useQuery<YoutubeApiResponse, Error>(
    `youtubeUrls-relatedToVideoId-${relatedToVideoId}`,
    () =>
      // relatedToVideoId
      // https://developers.google.com/youtube/v3/docs/search/list
      fetch(
        `https://youtube.googleapis.com/youtube/v3/search?part=snippet&relatedToVideoId=${relatedToVideoId}&type=video&key=${process.env.YOUTUBE_API_KEY}`
      ).then((res) => res.json()),
    { refetchOnWindowFocus: false, enabled }
  );

  return { isLoading, error, data };
}
