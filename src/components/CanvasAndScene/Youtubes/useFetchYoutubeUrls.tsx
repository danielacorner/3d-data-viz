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

// ! doesn't work -- too unlikely to generate a valid url from getRandomVideoId
// export async function fetchRandomYoutubeUrls(numUrlsToFetch: number) {
//   const validFakeIds: string[] = [];

//   // TODO: retry fetching urls until all the ids are valid
//   let retriesRemaining = 100;
//   while (retriesRemaining > 0 && validFakeIds.length < numUrlsToFetch) {
//     for (let i = 0; i < retriesRemaining + numUrlsToFetch; i++) {
//       const fakeId = getRandomVideoId();
//       const response = await fetch(
//         `https://www.youtube.com/oembed?format=json&url=https://www.youtube.com/watch?v=${fakeId}`
//       )
//         .then((resp) => resp.text())
//         .catch((err) => {
//           console.count(err);
//         });
//       console.log("🌟🚨 ~ fetchRandomYoutubeUrls ~ response", response);
//       const isError =
//         String(response).includes("Bad Request") ||
//         String(response).includes("Not Found");
//       if (!isError) {
//         validFakeIds.push(fakeId);
//       } else {
//         retriesRemaining--;
//       }
//     }
//   }

//   return Promise.resolve({
//     data: null,
//     youtubeUrls: validFakeIds.map(
//       (id) => `https://www.youtube.com/watch?v=${id}`
//     ),
//     youtubeIds: validFakeIds,
//   });
// }
