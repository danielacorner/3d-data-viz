import Layout from "./components/Layout";
import CanvasAndScene from "./components/CanvasAndScene/CanvasAndScene";
import { useSetAnimationStepOnScroll } from "./store/useSetAnimationStepOnScroll";
import ErrorBoundary from "./components/ErrorBoundary";
import useDetectIsZoomingOut from "./components/CanvasAndScene/useDetectIsZoomingOut";
import { CornerButtons } from "./CornerButtons";
import { ReactQueryDevtools } from "react-query/devtools";
import QueryClientProviderWithClient from "./components/QueryClientProviderWithClient";
import { EnterFirstYoutubeUrlForm } from "./components/EnterFirstYoutubeUrlForm";

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
