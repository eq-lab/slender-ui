import { PositionCell } from '@/entities/position/types'
import { PositionUpdate } from '../types'

export const getPositionUpdateByCells = (positionCells: PositionCell[]): PositionUpdate =>
  positionCells.reduce((positionUpdate: PositionUpdate, item: PositionCell): PositionUpdate => {
    positionUpdate[item.token] = item.value
    return positionUpdate
  }, {} as PositionUpdate)
