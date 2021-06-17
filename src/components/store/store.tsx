import { atom, useAtom } from "jotai";

// jotai vs zustand https://github.com/pmndrs/jotai/issues/13
// jotai + typescript https://docs.pmnd.rs/jotai/guides/typescript
// "jotai is bottom-up, like recoil; zustand is top-down, like redux

export const resetPositionKeyAtom = atom<number>(0);
export const isRollingDieAtom = atom<boolean>(false);
export const impulseAmountAtom = atom<number>(10);
export const isRollingCompleteAtom = atom<boolean>(false);
export const isZoomingOutAtom = atom<boolean>(false);
export const isSpinningAtom = atom<boolean>(true);
export const isScrollingAtom = atom<boolean>(false);
export const isScrollableAtom = atom<boolean>(true);
export const isPropertyAnimatingAtom = atom<boolean>(false);
export const isInfoOverlayVisibleAtom = atomWithLocalStorage(
  "store:isInfoOverlayVisible",
  false
);
export const scrollTopPctAtom = atom<number>(0);
export const scrollYAtom = atom<number>(0);
export const isZoomedAtom = atom<boolean>(false);
export function useIsZoomed() {
  const [animationStep] = useAtom(animationStepAtom);
  return animationStep > 1;
}
export const animationStepAtom = atomWithLocalStorage("store:animationStep", 0);
export function useAnimationStep() {
  return useAtom(animationStepAtom)[0];
}

export function useIsSpinning() {
  const isZoomed = useIsZoomed();
  const [isRollingDie] = useAtom(isRollingDieAtom);
  return !isZoomed && !isRollingDie;
}

export function useIsZoomedCamera() {
  const [isRollingDie] = useAtom(isRollingDieAtom);
  const [isRollingComplete] = useAtom(isRollingCompleteAtom);
  return isRollingDie && isRollingComplete;
}

//  jotai with localstorage
// const strAtom = atom(localStorage.getItem("myKey") ?? "foo");

// const strAtomWithPersistence = atom(
//   (get) => get(strAtom),
//   (get, set, newStr) => {
//     set(strAtom, newStr);
//     localStorage.setItem("myKey", newStr);
//   }
// );

// https://docs.pmnd.rs/jotai/guides/persistence
function atomWithLocalStorage<T>(key, initialValue: T) {
  const getInitialValue = (): T => {
    const item = localStorage.getItem(key);
    if (item !== null) {
      return JSON.parse(item);
    }
    return initialValue;
  };
  const baseAtom = atom<T>(getInitialValue());
  const derivedAtom = atom(
    (get) => get(baseAtom),
    (get, set, update) => {
      const nextValue =
        typeof update === "function" ? update(get(baseAtom)) : update;
      set(baseAtom, nextValue);
      localStorage.setItem(key, JSON.stringify(nextValue));
    }
  );
  return derivedAtom;
}
