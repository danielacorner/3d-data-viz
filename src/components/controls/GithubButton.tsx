import { IconButton, Tooltip } from "@material-ui/core";
import { GitHub } from "@material-ui/icons";
import styled from "styled-components/macro";

/** show or hide the info overlay */
export function GithubButton() {
  return (
    <GithubButtonStyles>
      <Tooltip title="source code 👩‍💻">
        <IconButton>
          <a
            href="https://github.com/danielacorner/shiny"
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
