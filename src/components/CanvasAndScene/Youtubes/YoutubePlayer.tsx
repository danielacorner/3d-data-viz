import { Billboard, Html } from "@react-three/drei";
import ReactPlayer from "react-player";
import { CAMERA_DISTANCE_FROM_PLAYER } from "../../../utils/constants";
import { useAnimateCameraPositionTo } from "../../../utils/useAnimateCameraPositionTo";
import { PLAYER_DIMENSIONS } from "./Youtubes";

const PLAYER_SCALE = 0.2;
export function YoutubePlayer({
  position,
  url,
  onClickAfterCameraMove,
  onClick,
}: {
  position: [number, number, number];
  url: string;
  onClickAfterCameraMove?: Function;
  onClick?: () => void;
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
        <ReactPlayer
          onClickPreview={handleClickPreview}
          width={530}
          height={300}
          style={{
            transform: `scale(${PLAYER_SCALE})`,
            transformOrigin: "top left",
          }}
          // playing={isPlaying}
          light={true}
          url={url}
        />
      </Html>
    </Billboard>
  );
}
