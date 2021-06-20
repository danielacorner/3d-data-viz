import { Button, Dialog, TextField } from "@material-ui/core";
import { useState } from "react";
import { useAtom } from "jotai";
import { initialYoutubeIdAtom } from "../store/store";
import styled from "styled-components/macro";
import ReactPlayer from "react-player";

export function EnterFirstYoutubeUrlForm() {
  const [open, setOpen] = useState(true);
  const [value, setValue] = useState("youtube.com/watch?v=eCbyqm9jcBA");
  const [, setInitialYoutubeId] = useAtom(initialYoutubeIdAtom);

  return (
    <Dialog open={open}>
      <EnterFirstYoutubeUrlFormStyles>
        <h1 className="title">🌳 youtube-forest</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const initialYoutubeId = getIdFromValue(value);
            setInitialYoutubeId(initialYoutubeId);
            setOpen(false);
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
              // onClickPreview={handleClickPreview}
              width={260}
              height={150}
              // playing={isPlaying}
              light={true}
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
    background: white;
    margin: auto;
    position: absolute;
    bottom: -300px;
    left: 0;
    right: 0;
  }
`;
function getIdFromValue(value: string): string {
  return value.includes("youtube.com")
    ? value.split("?v=")[1]
    : value.includes("youtu.be/")
    ? value.split(".be/")[1]
    : value;
}
