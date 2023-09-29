import styled, { css } from 'styled-components'
import Button from '@marginly/ui/components/button'
import DialogMui from '@mui/material/Dialog'

export const Inner = styled.div<{ $clean?: boolean }>`
  min-height: 476px;
  display: flex;
  padding: ${({ $clean }) => ($clean ? '32px 48px 48px' : '32px 32px 32px 48px')};
  gap: 48px;

  > div {
    width: 100%;
  }
`

export const Dialog = styled(DialogMui)<{ $clean?: boolean }>`
  .MuiPaper-root {
    position: static;
    border-radius: 48px;
    ${({ $clean }) => ($clean ? 'width: 520px;' : '')}
  }
  .MuiBackdrop-root {
    background: var(--background-overlay, rgba(245, 241, 240, 0.8));
    backdrop-filter: blur(12px);
  }
`

const modalButtonDefaultStyles = css`
  &&& {
    position: absolute;
    top: 32px;
    width: 32px;
    height: 32px;
    padding: 0px;

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
