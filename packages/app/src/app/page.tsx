import React from 'react'
import '@marginly/ui/styles/reset.css'
import { Header } from '@/widgets/header'
// import { Balances } from '@/widgets/balances'
import { BorrowFlow } from '@/widgets/borrow-flow'

export default function Home() {
  return (
    <main>
      <Header />
      {/* <Balances /> */}
      <BorrowFlow />
    </main>
  )
}
