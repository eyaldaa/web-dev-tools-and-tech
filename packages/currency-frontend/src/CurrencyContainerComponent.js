import React from 'react'
import AddCurrencyComponent from './AddCurrencyComponent'
import CurrencyList from './CurrencyList'
import fetchRates from './currencyRateFetcher'
import CalculatorDisplay from './CalculatorDisplay'
import CalculatorKeypad from './CalculatorKeypad'

export default class CurrencyContainerComponent extends React.Component {
  constructor(props) {
    super(props)

    this.state = {rates: [], calculator: {rates: undefined, display: ''}}
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
    return [
      <AddCurrencyComponent addCurrency={symbol => this.addCurrencySymbol(symbol)} key="1" />,
      <CurrencyList
        key="2"
        rates={this.state.rates}
        deleteCurrency={symbol => this.deleteCurrencySymbol(symbol)}
      />,
      <CalculatorDisplay display={this.state.calculator.display} />,
      <CalculatorKeypad
        currencies={this.state.rates.map(({symbol}) => symbol)}
        onKeypad={input => this.setState(state => ({...state, calculator: {display: input}}))}
      />,
    ]
  }
}
