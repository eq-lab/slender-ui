import React from 'react'
import { FooterButton } from './footer-link.styled'

export function FooterLink({
  href,
  title,
  children,
}: {
  href: string
  title: string
  children: React.ReactNode
}) {
  return (
    <a href={href} title={title} target="_blank" rel="nofollow">
      <FooterButton>{children}</FooterButton>
    </a>
  )
}
