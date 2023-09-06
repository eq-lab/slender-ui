enum Underlying {
  // the native XLM token
  'xlm' = 'CB64D3G7SM2RTH6JSGG34DDTFTQ5CFDKVDZJZSODMCX4NJ2HV2KN7OHT',
  'xrp' = 'CBZCT5E5OLBGUUTU3V7K47COJ5SQFSXNW2LZKN4Q6I3C7BZ6P6S2MCO2',
  'usdc' = 'CD2MXVTCMQEYXTU3L23WW4HBXFLIDCPAJ5Z4DJN6NO53HC74RVABZPCE',
}

enum SToken {
  'xlm' = 'CCFRPAUWPVA4262SXSCDMQIWGOJEYSLXICDBBCJ4G2L2RLEJX3QBSC5G',
  'xrp' = 'CCTY57YREWL2463QWJTFOEUBNEZQBY7A7IEQDXIFFXH66566PDWTDMIS',
  'usdc' = 'CCNUW2EQLVT766VAPG42ZKU4SMJUL3NUOP4YE4KX4Z6CWXRFNW4ARPD7',
}

enum DebtToken {
  'xlm' = 'CAPSAJ3O46QL7G7XFHGG632HZ2FSJGPYCLKCQM3IS767KIKOOFRJONWO',
  'xrp' = 'CDNVGXMLOFWODB7QCOQCEGN5MRULKPVX46AJGOW57WNN6G3PORX7D3EA',
  'usdc' = 'CDYIRILRL6J6QUY2EVNNUKX7IBAUGSBCQ2OO5PUY62D5UWP547CRFX4S',
}

export type TokenAddress = Underlying | SToken | DebtToken

export const cachedTokenAddresses = [
  ...Object.values(Underlying),
  ...Object.values(SToken),
  ...Object.values(DebtToken),
]

export const SUPPORTED_TOKENS = ['usdc', 'xlm', 'xrp'] as const

export type SupportedToken = (typeof SUPPORTED_TOKENS)[number]

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
    address: Underlying.xlm,
    sAddress: SToken.xlm,
    debtAddress: DebtToken.xlm,
  },
  xrp: {
    code: 'XRP',
    title: 'Ripple',
    address: Underlying.xrp,
    sAddress: SToken.xrp,
    debtAddress: DebtToken.xrp,
  },
  usdc: {
    code: 'USDC',
    title: 'USD Coin',
    address: Underlying.usdc,
    sAddress: SToken.usdc,
    debtAddress: DebtToken.usdc,
  },
}
