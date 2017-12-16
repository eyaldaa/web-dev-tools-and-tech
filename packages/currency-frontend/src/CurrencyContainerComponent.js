import React from 'react'
import AddCurrencyComponent from './AddCurrencyComponent'
import CurrencyList from './CurrencyList'
import fetchRates from './currencyRateFetcher'

export default class CurrencyContainerComponent extends React.Component {
  constructor(props) {
    super(props)

    this.state = {rates: []}
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
    ]
  }
}
