'use client'

import React, { useState } from 'react'

import { WaitModalContext } from './context'

export function WaitModalProvider({ children }: { children: JSX.Element }) {
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)

  return (
    <WaitModalContext.Provider value={{ modalIsOpen, setModalIsOpen }}>
      {children}
    </WaitModalContext.Provider>
  )
}
