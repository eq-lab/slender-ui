import { PositionCell } from '@/entities/position/types'
import { PositionUpdate } from '@/features/liquidity-flow/types'

export const getPositionUpdateByCells = (positionCells: PositionCell[]): PositionUpdate =>
  positionCells.reduce((positionUpdate: PositionUpdate, item: PositionCell): PositionUpdate => {
    positionUpdate[item.token] = item.value
    return positionUpdate
  }, {} as PositionUpdate)
