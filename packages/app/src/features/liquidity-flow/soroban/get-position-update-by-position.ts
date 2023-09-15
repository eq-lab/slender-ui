import { Position, PositionCell } from '@/entities/position/types'
import { PositionUpdate } from '@/features/liquidity-flow/types'

const reducePosition = (positionCells: PositionCell[]) =>
  positionCells.reduce((positionUpdate: PositionUpdate, item: PositionCell): PositionUpdate => {
    positionUpdate[item.token] = item.value
    return positionUpdate
  }, {} as PositionUpdate)
export const getPositionUpdateByPosition = ({
  deposits,
  debts,
}: Position): { deposits: PositionUpdate; debts: PositionUpdate } => ({
  deposits: reducePosition(deposits),
  debts: reducePosition(debts),
})
