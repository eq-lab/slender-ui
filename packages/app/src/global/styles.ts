'use client';

import { Plus_Jakarta_Sans as PlusJakartaSans } from 'next/font/google';
import { createGlobalStyle } from 'styled-components';

export const primaryFont = PlusJakartaSans({ subsets: ['latin'] });

export const GlobalStyle = createGlobalStyle`
:root {
  --default-font: ${primaryFont.style.fontFamily};
}

* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

html,
body {
  max-width: 100vw;
  font-family: var(--default-font);
  font-weight: 500;
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
`;
