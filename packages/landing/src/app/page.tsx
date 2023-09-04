import React from 'react'
import { Landing } from '@/widgets/landing/landing'
import { VersionAlert } from '@/widgets/version-alert'

export default function Home() {
  return (
    <main>
      <Landing />
      <VersionAlert />
    </main>
  )
}
