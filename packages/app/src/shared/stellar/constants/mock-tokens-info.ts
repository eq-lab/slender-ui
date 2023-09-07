import { SupportedToken } from './tokens'

const USER_USDT = 5000
const USER_XML = 10000
const USER_XRP = 3000
const USDC_DISCOUNT = 0.5
const XML_DISCOUNT = 0.4
const XRP_DISCOUNT = 0.6
const XML_USD = 0.123
const USDC_USD = 1
const XRP_USD = 0.53

export const mockTokenInfoByType: Record<
  SupportedToken,
  { userValue: number; discount: number; usd: number }
> = {
  xlm: {
    discount: XML_DISCOUNT,
    usd: XML_USD,
    userValue: USER_XML,
  },
  xrp: {
    discount: XRP_DISCOUNT,
    usd: XRP_USD,
    userValue: USER_XRP,
  },
  usdc: {
    discount: USDC_DISCOUNT,
    usd: USDC_USD,
    userValue: USER_USDT,
  },
}
