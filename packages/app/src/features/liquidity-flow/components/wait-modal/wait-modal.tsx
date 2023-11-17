'use client'

import React from 'react'
import { ReactComponent as FreighterLogo } from '@/shared/icons/logo/freighter.svg'
import Thumbnail from '@marginly/ui/components/thumbnail'
import Typography from '@marginly/ui/components/typography'
import { useSetWaitModalIsOpen, useWaitModalIsOpen } from '../../context/hooks'
import { Wrapper } from './wait-modal.styled'
import { Modal } from '../modal'

export function WaitModal() {
  const setWaitModalIsOpen = useSetWaitModalIsOpen()
  const handleClose = () => {
    setWaitModalIsOpen(false)
  }

  const waitModalIsOpen = useWaitModalIsOpen()
  if (!waitModalIsOpen) return null

  return (
    <Modal onClose={handleClose} open>
      <Wrapper>
        <Thumbnail xl className="icon-wrapper">
          <FreighterLogo width={48} />
        </Thumbnail>
        <Typography headerL className="header">
          Sign transactions
        </Typography>
        <Typography body className="text">
          In your Freighter browser extension.
        </Typography>
      </Wrapper>
    </Modal>
  )
}
