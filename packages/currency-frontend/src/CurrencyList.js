import React from 'react'
import './CurrencyList.css'

export default ({deleteCurrency, rates}) => (
  <div className="currency-list">
    {rates.map(({symbol, rate}) => (
      <div className="currency" key={symbol}>
        <div className="symbol">{symbol}</div>
        <div className="rate">{rate}</div>
        <button className="delete" onClick={() => deleteCurrency(symbol)}>
          -
        </button>
      </div>
    ))}
  </div>
)
