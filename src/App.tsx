import Layout from "./components/Layout";
import CanvasAndScene from "./components/CanvasAndScene/CanvasAndScene";
import { useSetAnimationStepOnScroll } from "./store/useSetAnimationStepOnScroll";
import ErrorBoundary from "./components/ErrorBoundary";
import useDetectIsZoomingOut from "./components/CanvasAndScene/useDetectIsZoomingOut";
import { CornerButtons } from "./CornerButtons";
import { ReactQueryDevtools } from "react-query/devtools";
import QueryClientProviderWithClient from "./components/QueryClientProviderWithClient";
import { Button, Dialog, TextField } from "@material-ui/core";
import { useState } from "react";
import { useAtom } from "jotai";
import { initialYoutubeIdAtom } from "./store/store";
import styled from "styled-components/macro";

export default function App() {
  useSetAnimationStepOnScroll();
  useDetectIsZoomingOut();

  return (
    <ErrorBoundary component={<div>❌ App.tsx!</div>}>
      <Layout>
        <EnterFirstYoutubeUrlForm />
        {/* <ScrollHandler> */}
        <CanvasAndScene />
        {/* </ScrollHandler> */}
        {/* <ScrollingOverlaySimple /> */}
        <CornerButtons />
        <QueryClientProviderWithClient>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProviderWithClient>
      </Layout>
    </ErrorBoundary>
  );
}

function EnterFirstYoutubeUrlForm() {
  const [open, setOpen] = useState(true);
  const [value, setValue] = useState(
    "https://www.youtube.com/watch?v=eCbyqm9jcBA"
  );
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
    width: 360px;
  }
`;

function getIdFromValue(value: string): string {
  // if the value has https:// in it, grab the piece after "?v="
  // otherwise, assume the value is an id
  return value.includes("https://") ? value.split("?v=")[1] : value;
}
