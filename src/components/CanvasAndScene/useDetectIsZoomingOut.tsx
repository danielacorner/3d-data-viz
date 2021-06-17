import { useAtom } from "jotai";
import { useEffect } from "react";
import { usePrevious } from "../../utils/hooks";
import { isZoomingOutAtom, useIsZoomed } from "../store/store";

/** detect whether we're zooming out (i.e. we're going back to animation step 0 from step >= 1, animating/transparent) */
export default function useDetectIsZoomingOut() {
  const isZoomed = useIsZoomed();
  const [isZoomingOut, setIsZoomingOut] = useAtom(isZoomingOutAtom);
  const prevIsZoomed = usePrevious(isZoomed);
  useEffect(() => {
    let timer = null as number | null;
    const nextIsZoomingOut = Boolean(prevIsZoomed && !isZoomed);
    if (nextIsZoomingOut) {
      timer = window.setTimeout(() => {
        setIsZoomingOut(false);
      }, 5 * 1000);
      setIsZoomingOut(true);
    }
    // if we're zooming back in, set({isZoomingOut:false})
    if (isZoomed) {
      setIsZoomingOut(false);
      if (timer) {
        window.clearTimeout(timer);
      }
    }
    return () => {
      if (timer) {
        window.clearTimeout(timer);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prevIsZoomed, isZoomed]);
  return isZoomingOut;
}
