import React from 'react'
import './AddCurrencyComponent.css'

export default class extends React.Component {
  constructor(props) {
    super(props)

    this.state = {currency: ''}
  }

  addCurrency() {
    this.props.addCurrency(this.state.currency)

    this.setState(() => ({currency: ''}))
  }

  render() {
    return (
      <div className="add-currency-component">
        <label>
          <h3 className="add-currency-title">Currency List</h3>
          <input
            id="currency-add"
            type="text"
            value={this.state.currency}
            placeholder="ILS"
            maxlength="4"
            onChange={e => this.setState({currency: e.target.value})}
            onKeyPress={e => (e.key === 'Enter' ? this.addCurrency() : undefined)}
          />
        </label>
        <button onClick={() => this.addCurrency(this.state.currency)}>Add!</button>
      </div>
    )
  }
}
