import { IconButton, Tooltip } from "@material-ui/core";
import { Undo } from "@material-ui/icons";
import { useThree } from "react-three-fiber";
import styled from "styled-components/macro";
import { INITIAL_CAMERA_POSITION } from "../../utils/constants";

/** show or hide the info overlay */
export function ResetPositionButton() {
  const { camera } = useThree();

  const { x, y, z } = INITIAL_CAMERA_POSITION;
  return (
    <ResetPositionButtonStyles>
      <Tooltip title="reset camera position">
        <IconButton>
          <IconButton
            onClick={() => {
              camera.position.set(x, y, z);
            }}
          >
            <Undo />
          </IconButton>
        </IconButton>
      </Tooltip>
    </ResetPositionButtonStyles>
  );
}
const ResetPositionButtonStyles = styled.div``;
