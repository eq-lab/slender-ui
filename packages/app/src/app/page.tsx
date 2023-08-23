'use client'

import React from 'react'
import '@marginly/ui/styles/reset.css'
import { LayoutSwitcher } from '../../components/mobile-placeholder.tsx/styled'
import MobilePlaceholder from './mobile-placeholder'

export default function Home() {
  return (
    <main>
      <LayoutSwitcher>
        <div className="desktop">app </div>
        <div className="mobile">
          <MobilePlaceholder />
        </div>
      </LayoutSwitcher>
    </main>
  )
}
