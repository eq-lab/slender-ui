import styled from 'styled-components'
import DialogMui from '@mui/material/Dialog'

export const Inner = styled.div`
  display: flex;
  padding: 32px 32px 32px 48px;
  gap: 48px;
`

export const Dialog = styled(DialogMui)`
  .MuiPaper-root {
    border-radius: 48px;
  }
`
