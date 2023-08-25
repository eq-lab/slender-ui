'use client'

import { Plus_Jakarta_Sans as PlusJakartaSans } from 'next/font/google'
import { createGlobalStyle } from 'styled-components'

export const primaryFont = PlusJakartaSans({ subsets: ['latin'] })

export const GlobalStyle = createGlobalStyle`
:root {
  --primary-font: ${primaryFont.style.fontFamily};
}

body {
  font-family: var(--primary-font);
  line-height: 1.5;
  box-sizing: border-box;
  margin: 0;
  font-size: 16px;
  max-width: 100vw;
  overflow-x: hidden !important;
  background: #000;
  font-variation-settings: 'wght' 500;
  letter-spacing: 0.01em;
  font-weight: normal;
  text-shadow: 0 0 0;
  color: #fff;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-weight: normal;
  text-shadow: 0 0 0;
}

p,
a {
  margin: 0;
}

* {
  box-sizing: border-box;
}

a {
  text-decoration: none;
}

a:hover {
  text-decoration: none;
}

button,
input {
  font-variation-settings: 'wght' 500;
  font-size: 16px;
  border: 0;
  outline: 0;
  box-shadow: 0 0 0;
  background: transparent;
}

button {
  cursor: pointer;
  transition: 300ms ease-out;
}

input:focus {
  outline: unset;
}

input[type='number'] {
  -moz-appearance: textfield;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type='range'],
input[type='range']::-webkit-slider-thumb,
input[type='range']::-webkit-media-slider-thumb,
input[type='range']::-webkit-slider-runnable-track {
  appearance: none;
  box-sizing: border-box;
  border: 0;
  outline: 0;
  box-shadow: none;
  background-image: none;
  background-color: transparent;
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  -webkit-appearance: none;
  -moz-appearance: none;
}

input[type='range']:focus {
  outline: none;
}

html {
  -webkit-text-size-adjust: none;
  touch-action: manipulation;
}

html,
body {
  scroll-behavior: smooth;
}

input:invalid {
  -webkit-box-shadow: none;
  box-shadow: none;
}

input:moz-submit-invalid {
  -webkit-box-shadow: none;
  box-shadow: none;
}

textarea:invalid {
  -webkit-box-shadow: none;
  box-shadow: none;
}

textarea:moz-submit-invalid {
  -webkit-box-shadow: none;
  box-shadow: none;
}
`
