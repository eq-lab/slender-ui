enum Underlying {
  // native XLM token
  'xlm' = 'CB64D3G7SM2RTH6JSGG34DDTFTQ5CFDKVDZJZSODMCX4NJ2HV2KN7OHT',
  'xrp' = 'CAZ2XLJZKWFNWRQAF5VE3HQMJGH3KDKT4PLJ6EEKUVJ4Y4C735FPWLO2',
  'usdc' = 'CDJM6XUBXAGACNPCEL22TZ753DWYEXFDPMBZREWQAEGDXCQ2IXID6NLB',
}

enum SToken {
  'xlm' = 'CB3CYOVCV4FV2TQXZXL4AECSOQRWBRWBQ5UJE5BUMUDZLIPMLSF6VKKW',
  'xrp' = 'CB2L7V2NVYWETT22FF5IKW5OVUDEJOEVSUXEOBYSMU4P73UUT5BVHDFF',
  'usdc' = 'CBAOL37Z4MYJDNKN5X2XVLBMCWMPFNVS53OVPXVIBNEWCUM3ROY7KCRQ',
}

export type TokenAddress = Underlying | SToken

export const cachedTokenAddresses = [...Object.values(Underlying), ...Object.values(SToken)]

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
