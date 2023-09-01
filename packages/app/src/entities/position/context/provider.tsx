'use client'

import React, { useState } from 'react'
import { Position } from '../types'
import { PositionContext } from './context'

export function PositionProvider({ children }: { children: JSX.Element }) {
  const [position, setPosition] = useState<Position>()

  return (
    <PositionContext.Provider value={{ position, setPosition }}>
      {children}
    </PositionContext.Provider>
  )
}
