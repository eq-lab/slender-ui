import styled from 'styled-components';
import MenuUi from '@mui/material/Menu';
import MenuItemUi from '@mui/material/MenuItem';
import ThumbnailUi from '@marginly/ui/components/thumbnail';

const MENU_WIDTH_PX = '280px';

export const ButtonWrapper = styled.div<{ $isAddAsset: boolean }>`
  position: ${({ $isAddAsset }) => ($isAddAsset ? 'static' : 'absolute')};
  top: 24px;
  right: 24px;
`;

export const Menu = styled(MenuUi)`
  .MuiMenu-paper {
    width: ${MENU_WIDTH_PX};
    transform: translate(calc(-${MENU_WIDTH_PX} + 12px + 48px), 8px) !important;
    border-radius: var(--rounding-radius-xl);
    background: var(--background-elevated, #fff);
    box-shadow:
      0 8px 24px 0 rgba(51, 20, 0, 0.08),
      0 4px 8px 0 rgba(51, 20, 0, 0.04);
  }
`;

export const MenuItem = styled(MenuItemUi)`
  &.MuiMenuItem-root {
    padding: 8px 24px 8px 16px;
  }
`;

export const ThumbnailWrapper = styled(ThumbnailUi)<{ $thumbnailBackgroundColor: string }>`
  &&& {
    cursor: pointer;
    background: ${({ $thumbnailBackgroundColor }) => $thumbnailBackgroundColor};
    svg {
      fill: var(--icon-on-dark);
    }
  }
`;

export const MenuItemInner = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 16px;
  grid-template-columns: 100%;
`;

export const MenuItemTextWrapper = styled.div`
  margin-right: auto;
`;
