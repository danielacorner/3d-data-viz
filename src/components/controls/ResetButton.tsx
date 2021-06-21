import { IconButton, Tooltip } from "@material-ui/core";
import { Undo } from "@material-ui/icons";
import { useAtom } from "jotai";
import styled from "styled-components/macro";
import {
  errorAtom,
  initialYoutubeIdAtom,
  playersAtom,
  positionsHistoryAtom,
  resetPositionKeyAtom,
} from "../../store/store";
import { INITIAL_PLAYER_POSITION } from "../../utils/constants";

/** show or hide the info overlay */
export function ResetButton() {
  const [, setResetPositionKey] = useAtom(resetPositionKeyAtom);
  const [, setPlayers] = useAtom(playersAtom);
  const [, setError] = useAtom(errorAtom);
  const [, setInitialYoutubeId] = useAtom(initialYoutubeIdAtom);
  const [, setPositionsHistory] = useAtom(positionsHistoryAtom);

  return (
    <ResetButtonStyles>
      <Tooltip title="start over">
        <IconButton
          onClick={() => {
            // trigger a camera position reset
            setResetPositionKey(Math.random());
            // reset players
            setInitialYoutubeId(null);
            setPlayers([]);
            setPositionsHistory([INITIAL_PLAYER_POSITION]);
            setError(null);
          }}
        >
          <Undo />
        </IconButton>
      </Tooltip>
    </ResetButtonStyles>
  );
}
const ResetButtonStyles = styled.div``;
