'use client'

import React from 'react'
import { getPublicKey } from '@stellar/freighter-api'
import { useWalletAddress } from '@/shared/contexts/use-wallet-address'
import { FREIGHTER_WALLET_URL } from '../../constants/wallet'

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

  if (address) {
    return `·${address.slice(-SHORT_ADDRESS_SIZE)}`
  }

  if (isConnected === null) {
    return null
  }

  if (!isConnected) {
    return (
      <button onClick={handleGetWalletClick} type="button">
        get freighter
      </button>
    )
  }

  return (
    <button onClick={handleConnectClick} type="button">
      connect
    </button>
  )
}
