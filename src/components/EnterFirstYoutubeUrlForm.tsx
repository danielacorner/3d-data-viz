import { Button, Dialog, TextField } from "@material-ui/core";
import { useState } from "react";
import { useAtom } from "jotai";
import { initialYoutubeIdAtom, playersAtom } from "../store/store";
import styled from "styled-components/macro";
import ReactPlayer from "react-player";

export function EnterFirstYoutubeUrlForm() {
  const [players] = useAtom(playersAtom);
  const open = players.length < 1;
  const [value, setValue] = useState("youtube.com/watch?v=eCbyqm9jcBA");
  const [, setInitialYoutubeId] = useAtom(initialYoutubeIdAtom);

  return (
    <Dialog open={open} PaperProps={{ style: { overflow: "visible" } }}>
      <EnterFirstYoutubeUrlFormStyles>
        <h1 className="title">🌳 youtube-forest</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const initialYoutubeId = getIdFromValue(value);
            setInitialYoutubeId(initialYoutubeId);
          }}
        >
          <TextField
            label="Enter a Youtube URL or ID"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={(event) => event.target.select()}
          />
          <Button type="submit" disabled={!value}>
            Go!
          </Button>
        </form>
        {getIsValueValid(value) && (
          <div className="player">
            <ReactPlayer
              width={260}
              height={150}
              // light={true}
              url={value}
            />
          </div>
        )}
      </EnterFirstYoutubeUrlFormStyles>
    </Dialog>
  );
}
function getIsValueValid(value: string) {
  const isYoutubeDotCom =
    value.includes("youtube.com") &&
    value.length >= "youtube.com/watch?v=eCbyqm9jcBA".length;
  const isYoutuDotBe =
    value.includes("youtu.be") &&
    value.length >= "youtu.be/watch?v=eCbyqm9jcBA".length;
  return isYoutubeDotCom || isYoutuDotBe;
}

const EnterFirstYoutubeUrlFormStyles = styled.div`
  max-width: calc(100vw - 32px);
  padding: 0.5em 1em;
  overflow: visible;
  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
  .MuiTextField-root {
    min-width: 260px;
  }
  input {
    font-size: 0.8em;
    margin-top: 0.5em;
  }
  .title {
    font-size: 1em;
  }
  position: relative;
  .player {
    pointer-events: none;
    margin: auto;
    position: absolute;
    bottom: -172px;
    background: white;
    opacity: 0.5;
  }
`;
function getIdFromValue(value: string): string {
  return value.includes("youtube.com")
    ? value.split("?v=")[1]
    : value.includes("youtu.be/")
    ? value.split(".be/")[1]
    : value;
}
