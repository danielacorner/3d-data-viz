import { Billboard, Html } from "@react-three/drei";
import ReactPlayer from "react-player";
import { CAMERA_DISTANCE_FROM_PLAYER } from "../../../utils/constants";
import { useAnimateCameraPositionTo } from "../../../utils/useAnimateCameraPositionTo";
import { PLAYER_DIMENSIONS } from "./Youtubes";
import { CircularProgress } from "@material-ui/core";
import { useAtom } from "jotai";
import { titleDisplayAtom } from "../../../store/store";

const PLAYER_SCALE = 0.2;
export function YoutubePlayer({
  position,
  url,
  onClickAfterCameraMove,
  onClick,
  isPlaying,
}: {
  position: [number, number, number];
  url: string | null;
  onClickAfterCameraMove?: Function;
  onClick?: () => void;
  isPlaying?: boolean;
}) {
  const { animateCameraPositionTo } = useAnimateCameraPositionTo(position);

  const viewingPosition: [number, number, number] = [
    position[0],
    position[1],
    position[2] + CAMERA_DISTANCE_FROM_PLAYER,
  ];

  const handleClickPreview = () => {
    if (onClick) {
      onClick();
    }
    animateCameraPositionTo({
      position: viewingPosition,
      afterAnimationCallbackFn: onClickAfterCameraMove,
    });
  };

  const [, setTitleDisplay] = useAtom(titleDisplayAtom);

  return (
    <Billboard position={position} {...({} as any)}>
      <boxBufferGeometry args={PLAYER_DIMENSIONS} />
      <meshBasicMaterial color="white" />
      {/* https://github.com/pmndrs/drei#html */}
      <Html
        className="react-player-wrapper"
        transform={true}
        sprite={false}
        style={{
          width: 530 * PLAYER_SCALE,
          height: 300 * PLAYER_SCALE,
        }}
      >
        {/* TODO: only show one player at a time, the rest are preview images */}
        {/* https://www.npmjs.com/package/react-player */}
        {url ? (
          <ReactPlayer
            onClickPreview={handleClickPreview}
            width={530}
            height={300}
            style={{
              transform: `scale(${PLAYER_SCALE})`,
              transformOrigin: "top left",
            }}
            playing={isPlaying}
            light={true}
            url={url}
            onReady={(reactplayer) => {
              const videoData = (reactplayer as any)?.player?.player?.player
                ?.playerInfo?.videoData;
              console.log("🌟🚨 ~ videoData", videoData);
              const title = videoData?.title;
              if (title) {
                setTitleDisplay(title);
              }
              console.log("🌟🚨 ~ reactplayer2", reactplayer);
            }}
          />
        ) : (
          <LoadingSpinner />
        )}
      </Html>
    </Billboard>
  );
}

function LoadingSpinner() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        placeContent: "center",
        placeItems: "center",
        transform: "scale(0.5)",
      }}
    >
      <CircularProgress />
    </div>
  );
}
