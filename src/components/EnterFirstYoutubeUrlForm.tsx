import { Button, Dialog, TextField } from "@material-ui/core";
import { useState } from "react";
import { useAtom } from "jotai";
import { initialYoutubeIdAtom } from "../store/store";
import styled from "styled-components/macro";

export function EnterFirstYoutubeUrlForm() {
  const [open, setOpen] = useState(true);
  const [value, setValue] = useState("youtube.com/watch?v=eCbyqm9jcBA");
  const [, setInitialYoutubeId] = useAtom(initialYoutubeIdAtom);
  return (
    <Dialog open={open}>
      <EnterFirstYoutubeUrlFormStyles>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const initialYoutubeId = getIdFromValue(value);
            setInitialYoutubeId(initialYoutubeId);
            setOpen(false);
          }}
        >
          <TextField
            label="Enter a Youtube URL or video ID"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <Button type="submit" disabled={!value}>
            Go!
          </Button>
        </form>
      </EnterFirstYoutubeUrlFormStyles>
    </Dialog>
  );
}
const EnterFirstYoutubeUrlFormStyles = styled.div`
  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    padding: 20px 40px;
  }
  .MuiTextField-root {
    width: 300px;
  }
`;
function getIdFromValue(value: string): string {
  return value.includes("youtube.com")
    ? value.split("?v=")[1]
    : value.includes("youtu.be/")
    ? value.split(".be/")[1]
    : value;
}
