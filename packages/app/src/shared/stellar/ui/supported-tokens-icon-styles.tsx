import React from 'react'
import { SupportedToken } from '../constants/tokens'
import { ReactComponent as RippleIcon } from './icons/ripple.svg'
import { ReactComponent as StellarIcon } from './icons/stellar.svg'
import { ReactComponent as UsdcIcon } from './icons/usdc.svg'

export const supportedTokensIconStyles: {
  [key in SupportedToken]: { color: string; Icon: React.FC<React.SVGProps<SVGSVGElement>> }
} = {
  xlm: {
    color: '#3E1BDB',
    Icon: StellarIcon,
  },
  xrp: {
    color: '#008CFF',
    Icon: RippleIcon,
  },
  usdc: {
    color: '#2775CA',
    Icon: UsdcIcon,
  },
}
