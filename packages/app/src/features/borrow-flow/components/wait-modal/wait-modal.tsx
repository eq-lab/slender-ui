'use client'

import React from 'react'
import { ModalLayout } from '../modal-layout'
import { useSetWaitModalIsOpen, useWaitModalIsOpen } from '../../context/hooks'

export function WaitModal() {
  const setWaitModalIsOpen = useSetWaitModalIsOpen()
  const handleClose = () => {
    setWaitModalIsOpen(false)
  }

  const waitModalIsOpen = useWaitModalIsOpen()
  if (!waitModalIsOpen) return null

  return (
    <ModalLayout onClose={handleClose}>
      <h2>Sign transactions</h2>
      <p>In your Freighter browser extension.</p>
    </ModalLayout>
  )
}
