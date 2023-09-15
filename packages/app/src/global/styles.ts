'use client'

import { Plus_Jakarta_Sans as PlusJakartaSans } from 'next/font/google'
import { createGlobalStyle } from 'styled-components'

export const primaryFont = PlusJakartaSans({ subsets: ['latin'] })

export const GlobalStyle = createGlobalStyle`
:root {
  --primary-font: ${primaryFont.style.fontFamily};
  --background-primary: #fff;
  --background-secondary: #F7F4F3;
  --background-elevated: #fff;
  --background-positive: #F0F9EC;
  --background-negative: #FCF0F7;
  --background-overflay: rgba(245, 241, 240, 0.8);

  --background-accent-primary: #99FFEE;
  --background-accent-secondary: #DEFEF9;

  --fill-primary: #000;
  --fill-primary-hover: #252222;
  --fill-secondary: rgba(204, 187, 184, 0.16);
  --fill-secondary-hover: rgba(178, 162, 162, 0.32);
  --fill-elevated: #FFFFFF;
  --fill-elevated-hover: #FAF8F7;
  --fill-positive-bg: rgba(165, 217, 139, 0.16);
  --fill-negative-bg: rgba(240, 165, 204, 0.16);
  --fill-accent-primary: #99FFEE;
  --fill-accent-secondary: rgba(50, 250, 220, 0.16);

  --text-primary: #000;
  --text-primary-hover: #646060;
  --text-secondary: rgba(66, 61, 60, 0.64);
  --text-secondary-hover: rgba(41, 35, 35, 0.72);
  --text-tertiary: rgba(140, 129, 126, 0.48);
  --text-on-dark: #fff;
  --text-on-light: #000;;
  --text-positive: #45BE33;
  --text-negative: #E54796;
  --text-accent: #5CDFD4;
  --text-invert-primary: #FFF;

  --color-accent-opaque-accent4: #33AFA6;

  --icon-tertiary: #C7C2C1;

  --border-focus: #000000;
  --border-negative: #E54796;

  --svg-invert: 0;

  --rounding-radius-m: 16px;
  --rounding-radius-xs: 8px;
  --rounding-radius-s: 16px;
  --rounding-radius-m: 24px;
  --rounding-radius-xl: 24px;
  --rounding-radius-xxl: 32px;
  --rounding-radius-xxxl: 48px;
}

* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

html,
body {
  max-width: 100vw;
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
