import { useEffect } from "react";
import { NUM_ANIMATION_STEPS } from "../../utils/constants";
import { useStore } from "./store";

export function useSetAnimationStepOnScroll() {
  const setAnimationStep = useStore((s) => s.setAnimationStep);
  const scrollTopPct = useStore((s) => s.scrollTopPct);

  useEffect(() => {
    // step goes from 1 to 21
    const step = Math.max(1, Math.ceil(scrollTopPct * NUM_ANIMATION_STEPS));
    setAnimationStep(step);
  }, [scrollTopPct, setAnimationStep]);
}
