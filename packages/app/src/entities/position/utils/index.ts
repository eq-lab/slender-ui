import { Position } from '../types'

export const checkPositionExists = (position: Position) =>
  Boolean(position.debts.length || position.deposits.length)
