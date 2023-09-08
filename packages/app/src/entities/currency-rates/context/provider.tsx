'use client'

import React, { useState, useEffect } from 'react'
import { CurrencyRates } from '../types'
import { CurrencyRatesContext } from './context'
import { getCryptoCurrenciesRates } from '../api/currency-rates'

const UPDATE_RATES_INTERVAL_MS = 60_000

export function CurrencyRatesProvider({ children }: { children: JSX.Element }) {
  const [currencyRates, setCurrencyRates] = useState<CurrencyRates>()

  const updateRates = async () => {
    const apiRates = await getCryptoCurrenciesRates()
    if (apiRates) setCurrencyRates(apiRates)
  }

  useEffect(() => {
    updateRates()
    const intervalId = setInterval(updateRates, UPDATE_RATES_INTERVAL_MS)
    return () => {
      clearInterval(intervalId)
    }
  }, [])

  return (
    <CurrencyRatesContext.Provider value={{ currencyRates }}>
      {children}
    </CurrencyRatesContext.Provider>
  )
}
