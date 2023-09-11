import {
  SLENDER_DEBT_TOKEN_USDC,
  SLENDER_DEBT_TOKEN_XLM,
  SLENDER_DEBT_TOKEN_XRP,
  SLENDER_S_TOKEN_USDC,
  SLENDER_S_TOKEN_XLM,
  SLENDER_S_TOKEN_XRP,
  SLENDER_TOKEN_USDC,
  SLENDER_TOKEN_XLM,
  SLENDER_TOKEN_XRP,
} from '@/shared/stellar/constants/contracts'

export const SUPPORTED_TOKENS = ['usdc', 'xlm', 'xrp'] as const

export type SupportedToken = (typeof SUPPORTED_TOKENS)[number]

export const underlying = {
  xlm: SLENDER_TOKEN_XLM,
  xrp: SLENDER_TOKEN_XRP,
  usdc: SLENDER_TOKEN_USDC,
} as const

export const sToken = {
  xlm: SLENDER_S_TOKEN_XLM,
  xrp: SLENDER_S_TOKEN_XRP,
  usdc: SLENDER_S_TOKEN_USDC,
} as const

export const debtToken = {
  xlm: SLENDER_DEBT_TOKEN_XLM,
  xrp: SLENDER_DEBT_TOKEN_XRP,
  usdc: SLENDER_DEBT_TOKEN_USDC,
}

export type Underlying = (typeof underlying)[keyof typeof underlying]
export type SToken = (typeof sToken)[keyof typeof sToken]
export type DebtToken = (typeof debtToken)[keyof typeof debtToken]
export type TokenAddress = Underlying | SToken | DebtToken

export interface Token {
  code: string
  title: string
  address: Underlying
  sAddress: SToken
  debtAddress: DebtToken
}

export const tokens: Record<SupportedToken, Token> = {
  xlm: {
    code: 'XLM',
    title: 'Lumen',
    address: underlying.xlm,
    sAddress: sToken.xlm,
    debtAddress: debtToken.xlm,
  },
  xrp: {
    code: 'XRP',
    title: 'Ripple',
    address: underlying.xrp,
    sAddress: sToken.xrp,
    debtAddress: debtToken.xrp,
  },
  usdc: {
    code: 'USDC',
    title: 'USD Coin',
    address: underlying.usdc,
    sAddress: sToken.usdc,
    debtAddress: debtToken.usdc,
  },
}
