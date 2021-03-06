import { Casino, Undo } from "@material-ui/icons";
import { IconButton, Tooltip } from "@material-ui/core";
import styled from "styled-components/macro";
import { useEffect, useState } from "react";
import { isRollingCompleteAtom, isRollingDieAtom } from "../../store/store";
import { animated, useSpring } from "react-spring";
import { ROLL_TIME } from "../../utils/constants";
import { useAtom } from "jotai";

const AnimatedIconButton = animated(IconButton);

/** show or hide the info overlay */
export function RollTheDieButton() {
  const [isRollingDie, setIsRollingDie] = useAtom(isRollingDieAtom);
  const [isRollingComplete, setIsRollingComplete] = useAtom(
    isRollingCompleteAtom
  );
  const [isHovered, setIsHovered] = useState(false);
  const springRoll = useSpring({
    transform: `rotate(${isHovered || isRollingDie ? 352 : 8}deg)`,
    opacity: isRollingDie ? 0 : 1,
  });
  const springReset = useSpring({ opacity: isRollingDie ? 1 : 0 });

  // when we reset to not-rolling, reset "is rolling complete" after a timeout
  useEffect(() => {
    let timer = null as number | null;

    if (isRollingComplete && !isRollingDie) {
      timer = window.setTimeout(() => setIsRollingComplete(false), ROLL_TIME);
    }
    return () => {
      if (timer) {
        window.clearTimeout(timer);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRollingComplete, isRollingDie]);

  return (
    <RollTheDieButtonStyles
      onMouseOut={() => setIsHovered(false)}
      onMouseOver={() => setIsHovered(true)}
    >
      <Tooltip title={"roll! 🎲"}>
        <AnimatedIconButton
          className="btnRoll"
          style={{
            ...springRoll,
            pointerEvents: isRollingDie ? "none" : "auto",
          }}
          onClick={() => setIsRollingDie(true)}
        >
          <Casino />
        </AnimatedIconButton>
      </Tooltip>
      <Tooltip title={"🔙 again"}>
        <AnimatedIconButton
          className="btnReset"
          style={{
            ...springReset,
            pointerEvents: isRollingDie ? "auto" : "none",
          }}
          onClick={() => {
            setIsRollingDie(false);
          }}
        >
          <Undo />
        </AnimatedIconButton>
      </Tooltip>
    </RollTheDieButtonStyles>
  );
}
const RollTheDieButtonStyles = styled.div`
  height: 48px;
  width: 48px;
  position: relative;
  .MuiButtonBase-root {
    color: hsla(0, 100%, 100%, 0.5);
  }
  .btnRoll {
  }
  .btnReset {
    position: absolute;
    top: 0;
    left: 0;
  }
`;
