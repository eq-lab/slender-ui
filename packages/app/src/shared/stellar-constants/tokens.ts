const XLM_ADDRESS = 'CD4UEK2CF6LEVAIMYRH7DOEN2AP3CKO763UO2HGBXHVCS5DIFTRKIIBM'
const XRP_ADDRESS = 'CAF2Z5L5INKVZBIQ3CDDAAHUNQOUS6NSYBUI6ZLK2DSHXBZ3I23HM6Q7'
const USDC_ADDRESS = 'CDZI6HFGUFB7XJWXLOWW6MUQQ6YX3NPA36ADTYNMRRX7H5YG7GK7I7SU'

type SupportedToken = 'xlm' | 'xrp' | 'usdc'

export interface Token {
  code: string
  title: string
  address: string
}

export const tokens: Record<SupportedToken, Token> = {
  xlm: {
    code: 'XLM',
    title: 'Lumen',
    address: XLM_ADDRESS,
  },
  xrp: {
    code: 'XRP',
    title: 'Ripple',
    address: XRP_ADDRESS,
  },
  usdc: {
    code: 'USDC',
    title: 'USD Coin',
    address: USDC_ADDRESS,
  },
}
