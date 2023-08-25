'use client'

import React from 'react'
import '@marginly/ui/styles/reset.css'
import { Header } from '../widgets/header'
import { LayoutSwitcher } from './components/layout-switcher'
import { MobilePlaceholder } from './components/mobile-placeholder/mobile-placeholder'

export default function Home() {
  return (
    <main>
      <LayoutSwitcher desktop={<Header />} mobile={<MobilePlaceholder />} />
    </main>
  )
}
