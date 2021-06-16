import create from "zustand";
import { useEffect } from "react";
import { useLocalStorageState } from "../../utils/hooks";

export function useSyncStoreStateToLS(stateKey: keyof GlobalStateType) {
  const set = useStore((s) => s.set);
  const state = useStore((s) => s[stateKey]);
  const [stateLS, setStateLS] = useLocalStorageState(
    `store:${stateKey}`,
    state
  );

  // sync with store state, state with store
  useEffect(() => {
    setStateLS(state);
    if (JSON.stringify(state) !== JSON.stringify(stateLS)) {
      set({ [stateKey]: stateLS });
    }
  }, [set, state, stateKey, stateLS, setStateLS]);
}

type GlobalStateType = {
  isZoomed: boolean;
  isRollingDie: boolean;
  impulseAmount: number;
  isRollingComplete: boolean;
  isZoomingOut: boolean;
  isSpinning: boolean;
  isScrolling: boolean;
  setIsScrolling: (newState: boolean) => any;
  /** if a property in the store is animating e.g. scale, can turn things on/off */
  isPropertyAnimating: boolean;
  isInfoOverlayVisible: boolean;
  scrollTopPct: number;
  animationStep: number;
  scrollY: number;
  setScrollY: (newState: number) => any;
  setScrollTopPct: (newState: number) => any;
  setAnimationStep: (newState: number) => any;
  set: (newState: any) => any;
};

// zustand https://github.com/pmndrs/zustand
// with typescript https://react-tracked.js.org/docs/tutorial-zustand-01/
export const useStore = create<GlobalStateType>(
  (set): GlobalStateType => ({
    isRollingDie: false,
    impulseAmount: 10,
    isRollingComplete: false,
    isZoomingOut: false,
    isSpinning: false,
    isScrolling: false,
    setIsScrolling: (val) => set({ isScrolling: val }),
    isZoomed: false,
    scrollY: 0,
    setScrollY: (num) => set({ scrollY: num }),
    isPropertyAnimating: false,
    isInfoOverlayVisible: false,
    scrollTopPct: 0,
    setScrollTopPct: (num) => set({ scrollTopPct: num }),
    animationStep: 0,
    setAnimationStep: (num) => set({ animationStep: num }),
    set: (newState) => set((state) => ({ ...state, ...newState })),
  })
);

export function useAnimationStep() {
  return useStore((s) => s.animationStep);
}

export function useIsZoomed() {
  const animationStep = useAnimationStep();
  return animationStep > 1;
}
export function useIsSpinning() {
  const isZoomed = useIsZoomed();
  const isRollingDie = useStore((s) => s.isRollingDie);
  return !isZoomed && !isRollingDie;
}

export function useIsZoomedCamera() {
  const isRollingDie = useStore((s) => s.isRollingDie);
  const isRollingComplete = useStore((s) => s.isRollingComplete);
  return isRollingDie && isRollingComplete;
}
