import { CurrencyRates } from '../types'

export const getCryptoCurrenciesRates = async () => {
  try {
    const result = await fetch('https://api.coinbase.com/v2/exchange-rates?currency=USD').then(
      (response) => {
        if (!response.ok) {
          throw new Error(response.statusText)
        }
        return response.json() as Promise<{ data: { rates: CurrencyRates } }>
      },
    )
    return result.data.rates
  } catch (error) {
    return null
  }
}
