'use client'

import React from 'react'
import { getPublicKey } from '@stellar/freighter-api'
import { useWalletAddress } from '@/shared/contexts/use-wallet-address'
import { ReactComponent as WalletIcon } from '@/shared/icons/wallet.svg'
import { FREIGHTER_WALLET_URL } from '../../constants/wallet'
import { Button } from './button'

const SHORT_ADDRESS_SIZE = 6

export function ConnectButton() {
  const { address, setAddress, isConnected } = useWalletAddress()

  const handleGetWalletClick = () => {
    window.open(FREIGHTER_WALLET_URL, '_blank')
  }

  const handleConnectClick = async () => {
    const publicKey = await getPublicKey()
    setAddress(publicKey)
  }

  if (isConnected === undefined) {
    return null
  }

  if (!isConnected) {
    return <Button onClick={handleGetWalletClick}>Get Freighter</Button>
  }

  if (address === undefined) {
    return null
  }

  if (!address) {
    return <Button onClick={handleConnectClick}>Connect</Button>
  }

  return (
    <Button inactive icon={<WalletIcon width={24} />}>
      ·{address.slice(-SHORT_ADDRESS_SIZE)}
    </Button>
  )
}
