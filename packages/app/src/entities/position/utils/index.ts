import { Position } from '../types'

export const checkPosition = (position: Position) =>
  Boolean(position.debts.length || position.deposits.length)
