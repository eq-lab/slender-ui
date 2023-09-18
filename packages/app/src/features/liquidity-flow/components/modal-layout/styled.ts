import styled from 'styled-components'
import DialogMui from '@mui/material/Dialog'

export const Inner = styled.div<{ $clean?: boolean }>`
  display: flex;
  padding: ${({ $clean }) => ($clean ? '32px 48px 48px' : '32px 32px 32px 48px')};
  gap: 48px;

  > div {
    width: 100%;
  }
`

export const Dialog = styled(DialogMui)<{ $clean?: boolean }>`
  .MuiPaper-root {
    border-radius: 48px;
    ${({ $clean }) => ($clean ? 'width: 520px;' : '')}
  }
`
