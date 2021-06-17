import { IconButton, Tooltip } from "@material-ui/core";
import { GitHub } from "@material-ui/icons";
import { useAtom } from "jotai";
import styled from "styled-components/macro";
import { isInfoOverlayVisibleAtom } from "../store/store";

/** show or hide the info overlay */
export function GithubButton() {
  const [isInfoOverlayVisible] = useAtom(isInfoOverlayVisibleAtom);
  return !isInfoOverlayVisible ? null : (
    <GithubButtonStyles>
      <Tooltip title="source code 👩‍💻">
        <IconButton>
          <a
            href="https://github.com/danielacorner/3d-data-viz"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GitHub />
          </a>
        </IconButton>
      </Tooltip>
    </GithubButtonStyles>
  );
}
const GithubButtonStyles = styled.div``;
