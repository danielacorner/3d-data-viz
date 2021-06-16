import { useDrag } from "@use-gesture/react";
import * as React from "react";
import styled from "styled-components/macro";
import { useStore } from "./store/store";
import { CUSTOM_SCROLLBAR_CSS } from "../utils/cssSnippets";
import { useInterval, useMount, useWindowSize } from "../utils/hooks";

export const HEIGHT_MULTIPLIER = 12;
export default function ScrollHandler({ children }) {
  // const set = useStore((s) => s.set);
  // const isScrollable = useIsScrollable();
  const windowSize = useWindowSize();
  const setScrollY = useStore((s) => s.setScrollY);
  const setScrollTopPct = useStore((s) => s.setScrollTopPct);
  const isRollingDie = useStore((s) => s.isRollingDie);

  const { bindDrag, ref: scrollRef } = useTrackIsScrolling();

  // const scrollTo = (y: number) => {
  //   set({
  //     scrollTopPct: y / maxY,
  //   });
  //   scrollRef.current.scrollTop = y;
  //   setScrollY(y);
  // };

  // const handleWheel = debounce((event) => {
  //   if (!isScrollable) {
  //     return;
  //   }
  //   const newScrollY = Math.max(0, Math.min(maxY, scrollY - event.wheelDeltaY));
  //   scrollTo(newScrollY);
  // });

  // useEventListener("wheel", handleWheel);

  // check the scroll height and update the state
  // * fake useFrame for outside a Canvas
  useInterval({
    callback: () => {
      const scrollTop = scrollRef?.current.scrollTop;
      setScrollY(scrollTop);
      const maxY = windowSize.height * (HEIGHT_MULTIPLIER - 1);
      // pct goes from 0 to 1
      const pct = scrollTop / maxY;
      setScrollTopPct(pct);
    },
    interval: 1000 / 60,
    immediate: false,
  });

  // const bind = useDrag(
  //   ({ offset: [x, y], distance, ...rest }) => {
  //     const newScrollY = Math.max(0, Math.min(maxY, scrollY - y));
  //     scrollTo(newScrollY);
  //   },
  //   {
  //     enabled: isScrollable,
  //     pointer: { touch: true },
  //   }
  // );
  // prevent pull-to-refresh when zoomed
  // const isZoomed = useIsZoomed();
  // React.useEffect(() => {
  //   document.body.style.overscrollBehavior = !isZoomed ? "unset" : "none";
  // }, [isZoomed]);

  return (
    <InvisibleScrollStyles>
      {children}
      <div
        className="scrollWrapper"
        {...bindDrag()}
        ref={scrollRef}
        style={{ pointerEvents: isRollingDie ? "none" : "auto" }}
      >
        <div className="scrollable" />
      </div>
    </InvisibleScrollStyles>
  );
}
const InvisibleScrollStyles = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  .scrollWrapper {
    ${CUSTOM_SCROLLBAR_CSS}
    overflow-x: hidden;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: scroll;
    /* pointer-events: none; */
    .scrollable {
      height: ${HEIGHT_MULTIPLIER * 100}vh;
      width: 100%;
    }
  }
`;

function useTrackIsScrolling() {
  const setIsScrolling = useStore((s) => s.setIsScrolling);
  const timerRef = React.useRef(null as any);
  const ref = React.useRef(null as any);

  function handleScroll() {
    // when we drag, set isScrolling true,
    setIsScrolling(true);
    // then set back to false later
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 1 * 1000);
  }

  useMount(() => {
    ref.current.addEventListener("scroll", handleScroll);
  });

  const bindDrag = useDrag((state) => handleScroll, {
    pointer: { touch: true },
  });
  return { bindDrag, ref };
}
