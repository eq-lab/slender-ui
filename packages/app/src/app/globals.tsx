'use client'

import localFont from 'next/font/local'
import { createGlobalStyle } from 'styled-components'

export const primaryFont = localFont({
  src: [
    {
      style: 'normal',
      weight: '500',
      path: './fonts/PlusJakartaSans-Medium.ttf',
    },
    {
      style: 'normal',
      weight: '700',
      path: './fonts/PlusJakartaSans-Bold.ttf',
    },
  ],
  fallback: ['sans-serif'],
})

export const GlobalStyle = createGlobalStyle`
  :root {
  --primary-font: ${primaryFont.style.fontFamily};
}

* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

html,
body {
  max-width: 100vw;
  overflow-x: hidden;
  font-family: var(--primary-font);
  font-weight: 500;
  text-shadow: 0 0 0;
}

body {
  color: rgb(var(--foreground-rgb));
  background: linear-gradient(to bottom, transparent, rgb(var(--background-end-rgb)))
    rgb(var(--background-start-rgb));
}

a {
  color: inherit;
  text-decoration: none;
}

@media (prefers-color-scheme: dark) {
  html {
    color-scheme: dark;
  }
}

`
