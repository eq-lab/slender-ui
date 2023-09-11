import { createContext } from 'use-context-selector'
import { CurrencyRates } from '../types'

interface CurrencyRatesContextModel {
  currencyRates?: CurrencyRates
}

export const CurrencyRatesContext = createContext<CurrencyRatesContextModel>(
  {} as CurrencyRatesContextModel,
)
