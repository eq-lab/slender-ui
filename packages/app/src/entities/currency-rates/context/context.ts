import { createContext } from 'use-context-selector'
import { CurrencyRates } from '../types'

interface CurrencyRatesContextModel {
  currencyRates?: CurrencyRates
  setCurrencyRates: (currencyRates: CurrencyRates) => void
}

export const CurrencyRatesContext = createContext<CurrencyRatesContextModel>(
  {} as CurrencyRatesContextModel,
)
