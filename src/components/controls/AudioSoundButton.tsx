import { VolumeUp, VolumeMute } from "@material-ui/icons";
import { IconButton, Tooltip } from "@material-ui/core";
import ReactPlayer from "react-player";
import styled from "styled-components/macro";
import { useLocalStorageState } from "../../utils/hooks";
import { getTimeOfDay } from "../../utils/timeUtils";

/** show or hide the info overlay */
export function AudioSoundButton() {
  const [isAudioPlaying, setIsAudioPlaying] = useLocalStorageState(
    // const [isAudioPlaying, setIsAudioPlaying] = useState(
    "isAudioPlaying",
    false // As of Chrome 66, videos must be muted in order to play automatically https://www.npmjs.com/package/react-player
  );

  const { isDaytime, isMonday, isRaining, isFriday } = getTimeOfDay();
  const music = isDaytime
    ? isMonday
      ? {
          title: "Skyrim - Music & Ambience - Towns",
          href: "https://www.youtube.com/watch?v=Y4KX-owEk98",
        }
      : isRaining
      ? {
          title: "Skyrim - Music & Ambience - Rainy Day",
          href: "https://www.youtube.com/watch?v=8F1-1j_ZDgc",
        }
      : isFriday
      ? {
          title: "Skyrim - Music & Ambience - Taverns",
          href: "https://www.youtube.com/watch?v=dd10InDdvJE",
        }
      : {
          title: "Skyrim - Music & Ambience - Day",
          href: "https://www.youtube.com/watch?v=hBkcwy-iWt8",
        }
    : isRaining
    ? {
        title: "Skyrim - Music & Ambience - Rainy Night",
        href: "https://www.youtube.com/watch?v=vgUaZz04bkw",
      }
    : {
        title: "Skyrim - Music & Ambience - Night",
        href: "https://www.youtube.com/watch?v=aK4JSwhdcdE",
      };
  return (
    <>
      <SoundButtonStyles>
        <Tooltip title={isAudioPlaying ? "mute 🔈" : "unmute 🔊"}>
          <IconButton onClick={() => setIsAudioPlaying(!isAudioPlaying)}>
            {isAudioPlaying ? <VolumeUp /> : <VolumeMute />}
          </IconButton>
        </Tooltip>
        <div className="soundInfo">
          <a href={music.href} target="_blank" rel="noopener noreferrer">
            {music.title}
          </a>
        </div>
      </SoundButtonStyles>
      <ReactPlayer
        style={{ visibility: "hidden", position: "fixed" }}
        playing={isAudioPlaying}
        url="https://www.youtube.com/watch?v=aK4JSwhdcdE"
      />
    </>
  );
}
const SoundButtonStyles = styled.div`
  height: 48px;
  width: 48px;
  white-space: nowrap;
  display: flex;
  align-items: center;
  .MuiButtonBase-root {
    color: hsla(0, 100%, 100%, 0.5);
  }
  .soundInfo {
    a {
      color: white;
    }
    opacity: 0;
  }
  &:hover {
    .soundInfo {
      opacity: 0.5;
    }
  }
`;
