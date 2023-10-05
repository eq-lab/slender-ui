'use client'

import React from 'react'
import { useWalletAddress } from '@/shared/contexts/use-wallet-address'
import { ReactComponent as WalletIcon } from '@/shared/icons/wallet.svg'
import { Button } from './button'
import { useWalletActions } from '../../hooks/use-wallet-action'

const SHORT_ADDRESS_SIZE = 4

export function ConnectButton() {
  const { address, isConnected } = useWalletAddress()
  const { connect, getWallet } = useWalletActions()

  if (isConnected === undefined) {
    return null
  }

  if (!isConnected) {
    return <Button onClick={getWallet}>Get Freighter</Button>
  }

  if (address === undefined) {
    return null
  }

  if (!address) {
    return <Button onClick={connect}>Connect</Button>
  }

  return (
    <Button disabled icon={<WalletIcon width={24} />}>
      ·{address.slice(-SHORT_ADDRESS_SIZE)}
    </Button>
  )
}
