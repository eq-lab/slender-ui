import styled from 'styled-components'
import { ThumbnailWrapper as ThumbnailWrapperUi } from '@marginly/ui/components/thumbnail/styled'

export const ThumbnailWrapper = styled(ThumbnailWrapperUi)`
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
