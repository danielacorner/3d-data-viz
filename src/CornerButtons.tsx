import styled from "styled-components/macro";
import { InfoButton } from "./components/controls/InfoButton";
import { ResetButton } from "./components/controls/ResetButton";
import { GithubButton } from "./components/controls/GithubButton";
import { getTimeOfDay } from "./utils/timeUtils";

export function CornerButtons() {
  const { isDaytime } = getTimeOfDay();

  return (
    <CornerButtonsStyles {...{ isDaytime }}>
      <div className="btn btnRollWrapper top right">
        <ResetButton />
      </div>
      <div className="btn btnInfoWrapper bottom left">
        <InfoButton />
      </div>
      <div className="btn btnGithubWrapper bottom right">
        <GithubButton />
      </div>
    </CornerButtonsStyles>
  );
}
const CornerButtonsStyles = styled.div`
  .btn {
    position: fixed;
    height: 48px;
    width: 48px;
  }
  button,
  a {
    color: hsla(0, 100%, 100%, 0.5);
  }
  .bottom {
    bottom: 12px;
    opacity: 0.7;

    button,
    a {
      color: hsla(0, 100%, ${(p) => (p.isDaytime ? 0 : 100)}%, 0.5);
    }
  }
  .left {
    left: 12px;
  }
  .top {
    top: 12px;
  }
  .right {
    right: 12px;
  }
`;
