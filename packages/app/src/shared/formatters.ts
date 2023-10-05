const FORMAT_USD_OPTIONS: Intl.NumberFormatOptions = {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
}

const FORMAT_CRYPTO_CURRENCY_OPTIONS = {
  maximumFractionDigits: 2,
}

const MINIMUM_LARGE_NUMBER = 1_000_000

const formatUsd = new Intl.NumberFormat('en-US', FORMAT_USD_OPTIONS).format
const formatCryptoCurrency = new Intl.NumberFormat('en-US', FORMAT_CRYPTO_CURRENCY_OPTIONS).format

type Formatter = (value: number | bigint) => string
type FormatterInput = number | string | bigint

const valueFormatSelector = ({
  largeFormatter,
  smallFormatter,
  value,
}: {
  largeFormatter: Formatter
  smallFormatter: Formatter
  value: FormatterInput
}) => {
  const numericalValue = typeof value === 'string' ? Number(value) : value
  const formatter = Number(value) >= MINIMUM_LARGE_NUMBER ? largeFormatter : smallFormatter
  return formatter(numericalValue)
}

export const formatCompactUsd = (value: FormatterInput) =>
  valueFormatSelector({
    largeFormatter: Intl.NumberFormat('en-US', {
      ...FORMAT_USD_OPTIONS,
      notation: 'compact',
    }).format,
    smallFormatter: formatUsd,
    value,
  })

export const formatCompactCryptoCurrency = (value: FormatterInput) =>
  valueFormatSelector({
    largeFormatter: Intl.NumberFormat('en-US', {
      ...FORMAT_CRYPTO_CURRENCY_OPTIONS,
      notation: 'compact',
    }).format,
    smallFormatter: formatCryptoCurrency,
    value,
  })

export const formatPercent = (value: number): string => `${+value.toFixed(1)}%`
