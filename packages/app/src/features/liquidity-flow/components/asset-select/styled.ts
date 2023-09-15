import styled from 'styled-components'
import { ThumbnailWrapper as ThumbnailWrapperUi } from '@marginly/ui/components/thumbnail/thumbnail.styled'

export const ThumbnailWrapper = styled(ThumbnailWrapperUi)`
  box-shadow:
    0px 4px 8px 0px rgba(51, 20, 0, 0.08),
    0px 2px 1px 0px rgba(51, 20, 0, 0.04);
  cursor: pointer;
`

export const MenuItemInner = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`