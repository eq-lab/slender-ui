import React from 'react'
import { Landing } from '@/widgets/landing/landing'
import { VersionAlert } from '@slender/shared/components/version-alert'

export default function Home() {
  return (
    <main>
      <Landing />
      <VersionAlert />
    </main>
  )
}
