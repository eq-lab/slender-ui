import styled from 'styled-components'
import MenuUi from '@mui/material/Menu'
import MenuItemUi from '@mui/material/MenuItem'
import ThumbnailUi from '@marginly/ui/components/thumbnail'

export const Menu = styled(MenuUi)`
  .MuiMenu-paper {
    border-radius: var(--rounding-radius-xl);
    background: var(--background-elevated, #fff);
    box-shadow:
      0px 8px 24px 0px rgba(51, 20, 0, 0.08),
      0px 4px 8px 0px rgba(51, 20, 0, 0.04);
  }
`

export const MenuItem = styled(MenuItemUi)`
  &.MuiMenuItem-root {
    padding: 8px 16px;
  }
`

export const ThumbnailWrapper = styled(ThumbnailUi)`
  box-shadow:
    0 4px 8px 0 rgba(51, 20, 0, 0.08),
    0 2px 1px 0 rgba(51, 20, 0, 0.04);
  cursor: pointer;
`

export const MenuItemInner = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`
