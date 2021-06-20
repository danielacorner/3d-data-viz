import { IconButton, Tooltip } from "@material-ui/core";
import { Undo } from "@material-ui/icons";
import { useAtom } from "jotai";
import styled from "styled-components/macro";
import {
  errorAtom,
  initialYoutubeIdAtom,
  playersAtom,
  resetPositionKeyAtom,
} from "../../store/store";

/** show or hide the info overlay */
export function ResetPositionButton() {
  const [, setResetPositionKey] = useAtom(resetPositionKeyAtom);
  const [, setPlayers] = useAtom(playersAtom);
  const [, setError] = useAtom(errorAtom);
  const [, setInitialYoutubeId] = useAtom(initialYoutubeIdAtom);

  return (
    <ResetPositionButtonStyles>
      <Tooltip title="start over">
        <IconButton
          onClick={() => {
            // trigger a camera position reset
            setResetPositionKey(Math.random());
            // reset players
            setInitialYoutubeId(null);
            setPlayers([]);
            setError(null);
          }}
        >
          <Undo />
        </IconButton>
      </Tooltip>
    </ResetPositionButtonStyles>
  );
}
const ResetPositionButtonStyles = styled.div``;
