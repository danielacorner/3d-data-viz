import Layout from "./components/Layout";
import CanvasAndScene from "./components/CanvasAndScene/CanvasAndScene";
import { useSetAnimationStepOnScroll } from "./store/useSetAnimationStepOnScroll";
import ErrorBoundary from "./components/ErrorBoundary";
import useDetectIsZoomingOut from "./components/CanvasAndScene/useDetectIsZoomingOut";
import { CornerButtons } from "./CornerButtons";

export default function App() {
  useSetAnimationStepOnScroll();
  useDetectIsZoomingOut();

  return (
    <ErrorBoundary component={<div>❌ App.tsx!</div>}>
      <Layout>
        {/* <ScrollHandler> */}
        <CanvasAndScene />
        {/* </ScrollHandler> */}
        {/* <ScrollingOverlaySimple /> */}
        <CornerButtons />
      </Layout>
    </ErrorBoundary>
  );
}
