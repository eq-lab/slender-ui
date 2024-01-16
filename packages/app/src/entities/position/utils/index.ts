import { Position } from '../types';

export const checkPositionExists = (position: Position): boolean =>
  Boolean(position.debts.length || position.deposits.length);
