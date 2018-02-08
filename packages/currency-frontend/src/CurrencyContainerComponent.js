import React from 'react'
import AddCurrencyComponent from './AddCurrencyComponent'
import CurrencyList from './CurrencyList'
import fetchRates from './currencyRateFetcher'
import fetchNextCalculatorState from './calculatorService'
import CalculatorDisplay from './CalculatorDisplay'
import CalculatorKeypad from './CalculatorKeypad'

import './CurrencyContainerComponent.css'

export default class CurrencyContainerComponent extends React.Component {
  constructor(props) {
    super(props)

    this.state = {rates: [], calculatorState: undefined}
  }

  componentDidMount() {
    this.fetchRatesForSymbols()
  }

  async fetchRatesForSymbols() {
    const newRates = await fetchRates({
      symbols: this.state.rates.map(({symbol}) => symbol),
      baseCurrencySymbol: 'USD',
    })

    this.setState(rates => ({rates: newRates}))
  }

  async nextCalculatorState(input) {
    const nextCalculatorState = await fetchNextCalculatorState(
      this.state.calculatorState,
      input,
      this.state.rates,
    ).catch(err => (err.message.includes('status: 404') ? {display: input} : Promise.reject(err)))

    this.setState(state => ({calculatorState: nextCalculatorState}))
  }

  addCurrencySymbol(symbolToAdd) {
    this.setState(
      state => ({
        rates: state.rates.find(({symbol}) => symbol === symbolToAdd)
          ? state.rates
          : Array.from(new Set(state.rates.concat([{symbol: symbolToAdd}]))),
      }),
      () => this.fetchRatesForSymbols(),
    )
  }

  deleteCurrencySymbol(symbolToDelete) {
    this.setState(state => ({
      rates: state.rates.filter(({symbol}) => symbol !== symbolToDelete),
    }))
  }

  render() {
    return (
      <div className="app-wrapper">
        <div className="currency-wrapper">
          <AddCurrencyComponent addCurrency={symbol => this.addCurrencySymbol(symbol)} key="1" />
          <CurrencyList
            key="2"
            rates={this.state.rates}
            deleteCurrency={symbol => this.deleteCurrencySymbol(symbol)}
          />
        </div>
        <div className="calculator-wrapper">
          <div className="display-wrapper">
            <CalculatorDisplay display={(this.state.calculatorState || {}).display} />
          </div>
          <CalculatorKeypad
            currencies={this.state.rates.map(({symbol}) => symbol)}
            onKeypad={input => this.nextCalculatorState(input)}
          />
        </div>
      </div>
    )
  }
}
