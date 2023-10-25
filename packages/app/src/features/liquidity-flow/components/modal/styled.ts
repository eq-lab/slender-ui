import styled, { css } from 'styled-components'
import Button from '@marginly/ui/components/button'
import DialogMui from '@mui/material/Dialog'

export const Dialog = styled(DialogMui)`
  .MuiPaper-root {
    position: static;
    border-radius: 48px;
    box-shadow: 0px 8px 32px 0px rgba(51, 20, 0, 0.16);
  }
  .MuiBackdrop-root {
    background: var(--background-overlay);
    backdrop-filter: blur(12px);
  }
`

const modalButtonDefaultStyles = css`
  &&& {
    position: absolute;
    top: 32px;
    width: 32px;
    height: 32px;
    padding: 0;

    svg {
      width: 24px;
      margin: auto;
    }
  }
`

export const CloseButton = styled(Button)`
  ${modalButtonDefaultStyles}
  &&& {
    right: 32px;
  }
`

export const BackButton = styled(Button)`
  ${modalButtonDefaultStyles}
  &&& {
    left: 32px;
  }
`
