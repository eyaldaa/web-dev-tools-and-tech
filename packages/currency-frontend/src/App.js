import React, {Component} from 'react'
import logo from './logo.svg'
import './App.css'
import CurrencyContainerComponent from './CurrencyContainerComponent'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Currency Conversions List</h1>
        </header>
        <div className="add-currency-container-component">
          <CurrencyContainerComponent />
        </div>
      </div>
    )
  }
}

export default App
