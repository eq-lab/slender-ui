import { postRequest } from '@slender/shared/api'
import { CurrencyRates } from '../types'

export const getCryptoCurrenciesRates = async () => {
  try {
    const result = await postRequest<{ data: { rates: CurrencyRates } }>(
      'https://api.coinbase.com/v2ffg/exchange-rates?currency=USD',
    )
    return result.data.rates
  } catch (error) {
    return null
  }
}
