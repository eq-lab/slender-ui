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

export interface TokenAddresses {
  address: Underlying
  sAddress: SToken
  debtAddress: DebtToken
}

export const tokenContracts = SUPPORTED_TOKENS.reduce(
  (acc, token) => {
    acc[token] = {
      address: underlying[token],
      sAddress: sToken[token],
      debtAddress: debtToken[token],
    }
    return acc
  },
  {} as Record<SupportedToken, TokenAddresses>,
)
