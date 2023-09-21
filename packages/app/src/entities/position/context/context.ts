import { createContext } from 'use-context-selector'
import { Position } from '../types'

interface PositionContextModel {
  position: Position
  setPosition: (value: Position) => void
  updatePosition: () => void
}

export const PositionContext = createContext<PositionContextModel>({} as PositionContextModel)
