import { useAtom } from "jotai";
import { useEffect } from "react";
import { NUM_ANIMATION_STEPS } from "../../utils/constants";
import { animationStepAtom, scrollTopPctAtom } from "./store";

export function useSetAnimationStepOnScroll() {
  const [, setAnimationStep] = useAtom(animationStepAtom);
  const [scrollTopPct] = useAtom(scrollTopPctAtom);

  useEffect(() => {
    // step goes from 1 to 21
    const step = Math.max(1, Math.ceil(scrollTopPct * NUM_ANIMATION_STEPS));
    setAnimationStep(step);
  }, [scrollTopPct, setAnimationStep]);
}
