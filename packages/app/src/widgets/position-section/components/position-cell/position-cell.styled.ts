import styled from 'styled-components'

export const ThumbnailWrapper = styled.div<{ backgroundColor: string }>`
  background: red;
`

export const PositionCellWrapper = styled.div`
  display: flex;
  gap: 16px;
`

export const PositionCellInfo = styled.div`
  width: 100%;
  display: flex;
  gap: 8px;
`

export const PositionCellInfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 50%;
`

export const PositionCellTokenAmount = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
`

export const PositionCellButtons = styled.div`
  display: flex;
  gap: 8px;
`
