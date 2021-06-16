import { useMount } from "../../utils/hooks";

export function useAddShadowsToGltf(ref) {
  useMount(() => {
    ref.current?.traverse((object) => {
      object.depthTest = true;
      if (object.isMesh) {
        object.castShadow = true;
        object.receiveShadow = true;
      }
    });
  });
}
