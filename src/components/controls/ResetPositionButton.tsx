import { IconButton, Tooltip } from "@material-ui/core";
import { Undo } from "@material-ui/icons";
import { useAtom } from "jotai";
import styled from "styled-components/macro";
import { resetPositionKeyAtom } from "../store/store";

/** show or hide the info overlay */
export function ResetPositionButton() {
  const [, setResetPositionKey] = useAtom(resetPositionKeyAtom);
  return (
    <ResetPositionButtonStyles>
      <Tooltip title="reset camera position">
        <IconButton>
          <IconButton
            onClick={() => {
              // trigger a camera position reset
              setResetPositionKey(Math.random());
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
