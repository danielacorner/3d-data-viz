import styled from "styled-components/macro";
import { useDetectGPU } from "@react-three/drei";
import { useStore } from "./store/store";

const Layout = ({ children }) => {
  const gpuInfo = useDetectGPU();
  const isInfoOverlayVisible = useStore((s) => s.isInfoOverlayVisible);

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
`;

export default Layout;
