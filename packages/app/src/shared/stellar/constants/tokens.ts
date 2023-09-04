export const XLM_ADDRESS = 'CB64D3G7SM2RTH6JSGG34DDTFTQ5CFDKVDZJZSODMCX4NJ2HV2KN7OHT'

enum Underlying {
  'xlm' = 'CD4UEK2CF6LEVAIMYRH7DOEN2AP3CKO763UO2HGBXHVCS5DIFTRKIIBM',
  'xrp' = 'CAF2Z5L5INKVZBIQ3CDDAAHUNQOUS6NSYBUI6ZLK2DSHXBZ3I23HM6Q7',
  'usdc' = 'CDZI6HFGUFB7XJWXLOWW6MUQQ6YX3NPA36ADTYNMRRX7H5YG7GK7I7SU',
}

enum SToken {
  'xlm' = 'CAC2ASEKVFU4YH5HIY3OUG2D2KSEUMFEZ36R2LHM53HMEISGWNXEBVW7',
  'xrp' = 'CC4UUAVB66BT4XATZY5YJIGLEYS4ADVRIIYMTAQ4HBMMO3YYC2ASRHEC',
  'usdc' = 'CC2M4S57Y6QH3EEE4JXIL4LZHJ7EN57KBXWGMKDCZRH4HT5ROXX5U7VK',
}

export type TokenAddress = typeof XLM_ADDRESS | Underlying | SToken

export const cachedTokenAddresses = [
  XLM_ADDRESS,
  ...Object.values(Underlying),
  ...Object.values(SToken),
] as TokenAddress[]

export const SUPPORTED_TOKENS = ['usdc', 'xlm', 'xrp'] as const

export type SupportedToken = (typeof SUPPORTED_TOKENS)[number]

export interface Token {
  code: string
  title: string
  address: Underlying
  sAddress: SToken
}

export const tokens: Record<SupportedToken, Token> = {
  xlm: {
    code: 'XLM',
    title: 'Lumen',
    address: Underlying.xlm,
    sAddress: SToken.xlm,
  },
  xrp: {
    code: 'XRP',
    title: 'Ripple',
    address: Underlying.xrp,
    sAddress: SToken.xrp,
  },
  usdc: {
    code: 'USDC',
    title: 'USD Coin',
    address: Underlying.usdc,
    sAddress: SToken.usdc,
  },
}
