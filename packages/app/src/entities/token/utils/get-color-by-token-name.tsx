import { SupportedToken } from '@/shared/stellar/constants/tokens'

export const getColorByTokenName = (tokenName: SupportedToken) => {
  const colorByToken = {
    usdc: '#2775CA',
    xlm: '#3E1BDB',
    xrp: '#008CFF',
  }
  return colorByToken[tokenName]
}
