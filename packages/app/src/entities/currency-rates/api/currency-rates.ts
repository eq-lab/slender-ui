import { postRequest } from '@slender/shared/api'
import { CurrencyRates } from '../types'

const ratesApiUrl = 'https://api.coinbase.com/v2/exchange-rates?currency=USD'

export const getCryptoCurrencyRates = async () => {
  try {
    const result = await postRequest<{ data: { rates: CurrencyRates } }>(ratesApiUrl)
    return result.data.rates
  } catch {
    return null
  }
}
