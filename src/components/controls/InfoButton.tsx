import { isInfoOverlayVisibleAtom } from "../../store/store";
import { Info } from "@material-ui/icons";
import { IconButton, Tooltip } from "@material-ui/core";
import styled from "styled-components/macro";
import { getTimeOfDay } from "../../utils/timeUtils";
import { useAtom } from "jotai";

/** show or hide the info overlay */
export function InfoButton() {
  const [isInfoOverlayVisible, setIsInfoOverlayVisible] = useAtom(
    isInfoOverlayVisibleAtom
  );

  const { isDaytime } = getTimeOfDay();
  return (
    <InfoButtonStyles>
      <Tooltip title="ℹ more info">
        <IconButton
          onClick={() => {
            setIsInfoOverlayVisible(!isInfoOverlayVisible);
          }}
          style={{ color: `hsla(0,0%,${isDaytime ? 0 : 100}%,50%)` }}
        >
          <Info />
        </IconButton>
      </Tooltip>
    </InfoButtonStyles>
  );
}
const InfoButtonStyles = styled.div`
  .MuiButtonBase-root {
    color: hsla(0, 100%, 100%, 0.5);
  }
`;
