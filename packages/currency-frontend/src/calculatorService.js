export default async function(calculatorState, input, rates) {
  const ratesForCalculate = rates.reduce((acc, {symbol, rate}) => ({...acc, [symbol]: rate}), {})

  const response = await fetch('/calculate', {
    method: 'POST',
    headers: {'content-type': 'application/json'},
    body: JSON.stringify({calculatorState, input, rates: ratesForCalculate}),
    credentials: 'same-origin',
  })

  if (!response.ok)
    throw new Error(`failed to fetch next calculator step. status: ${response.status}`)

  return await response.json()
}
