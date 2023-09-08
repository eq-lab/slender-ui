'use client'

import React, { useState, useEffect } from 'react'
import { CurrencyRates } from '../types'
import { CurrencyRatesContext } from './context'
import { getCryptoCurrenciesRates } from '../api/currency-rates'

const UPDATE_RATES_INTERVAL_MS = 60_000

export function CurrencyRatesProvider({ children }: { children: JSX.Element }) {
  const [currencyRates, setCurrencyRates] = useState<CurrencyRates>()

  const getRates = async () => {
    const apiRates = await getCryptoCurrenciesRates()
    if (apiRates) setCurrencyRates(apiRates)
  }

  useEffect(() => {
    getRates()
    const intervalId = setInterval(() => {
      getRates()
    }, UPDATE_RATES_INTERVAL_MS)
    return () => {
      clearInterval(intervalId)
    }
  }, [])

  return (
    <CurrencyRatesContext.Provider value={{ currencyRates, setCurrencyRates }}>
      {children}
    </CurrencyRatesContext.Provider>
  )
}
