import retry from 'retry-as-promised'

export default (window.useCurrencyBackend ? fetchRatesFromCurrencyBackend : fetchRatesFromFixer)

async function fetchRatesFromFixer({symbols, baseCurrencySymbol}) {
  if (!symbols || symbols.length === 0) return []

  const fixerRates = await retry(
    async () => {
      const response = await fetch(
        `https://api.fixer.io/latest?symbols=${symbols.join(',')}&base=${baseCurrencySymbol}`,
      )
      if (!response.ok) throw new Error(`could not fetch quotes. status: ${response.status}`)

      return await response.json()
    },
    {max: 3},
  )

  return Object.entries(fixerRates.rates).map(([symbol, rate]) => ({symbol, rate}))
}

async function fetchRatesFromCurrencyBackend({symbols, baseCurrencySymbol}) {
  if (!symbols || symbols.length === 0) return []

  const response = await fetch(
    `/rates?symbols=${encodeURI(symbols.join(','))}&base=${encodeURI(baseCurrencySymbol)}`,
    {
      credentials: 'same-origin',
    },
  )
  if (!response.ok) throw new Error(`could not fetch quotes. status: ${response.status}`)

  const rates = await response.json()

  return Object.entries(rates).map(([symbol, rate]) => ({symbol, rate}))
}
