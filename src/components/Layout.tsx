import styled from "styled-components/macro";
import { useDetectGPU } from "@react-three/drei";
import { isInfoOverlayVisibleAtom } from "../store/store";
import { useAtom } from "jotai";
export const DISABLE_HOVER_CLASS = "disable-hover";

const Layout = ({ children }) => {
  const gpuInfo = useDetectGPU();
  const [isInfoOverlayVisible] = useAtom(isInfoOverlayVisibleAtom);

  return (
    <LayoutStyles>
      {children}
      {isInfoOverlayVisible && (
        <div className="gpuInfo">{JSON.stringify(gpuInfo)}</div>
      )}
    </LayoutStyles>
  );
};

const LayoutStyles = styled.main`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  .gpuInfo {
    background: hsla(0, 0%, 100%, 0.5);
    position: fixed;
    top: 64px;
    left: 0px;
    width: calc(100vw - 16px);
  }
  .${DISABLE_HOVER_CLASS} {
    pointer-events: none;
  }
`;

export default Layout;
