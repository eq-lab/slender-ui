'use client'

import React from 'react'
import { coinInfoByType } from './constants'
import { SingleBorrowFlow } from './components/single-borrow-flow'

export function BorrowFlow() {
  return (
    <div>
      <div>user xml: {coinInfoByType.xlm.userValue} (FAKE)</div>
      <div>user xrp: {coinInfoByType.xrp.userValue} (FAKE)</div>
      <div>user usdc: {coinInfoByType.usdc.userValue} (FAKE)</div>
      <SingleBorrowFlow type="usdc" />
      <SingleBorrowFlow type="xlm" />
      <SingleBorrowFlow type="xrp" />
    </div>
  )
}
