import React from 'react'

const CalculatorKeypad = ({onKeypad, currencies}) => {
  const numeric = digit => (
    <td onClick={() => onKeypad(digit)} className={`digit-${digit}`}>
      {digit}
    </td>
  )
  const operator = (operator, name) => (
    <td onClick={() => onKeypad(operator)} className={`operator operator-${name}`}>
      {operator}
    </td>
  )

  const currencyList = (
    <td>
      <select onChange={event => onKeypad(event.target.value)}>
        {currencies.map(currency => (
          <option key={currency} value={currency}>
            {currency}
          </option>
        ))}
      </select>
    </td>
  )

  return (
    <table>
      <tbody>
        <tr>
          {numeric('7')}
          {numeric('8')}
          {numeric('9')}
          {operator('/', 'divide')}
        </tr>
        <tr>
          {numeric('4')}
          {numeric('5')}
          {numeric('6')}
          {operator('*', 'multiply')}
        </tr>
        <tr>
          {numeric('1')}
          {numeric('2')}
          {numeric('3')}
          {operator('-', 'subtract')}
        </tr>
        <tr>
          {currencyList}
          {numeric('0')}
          {operator('+', 'plus')}
          {operator('=', 'equals')}
        </tr>
        <tr />
      </tbody>
    </table>
  )
}

export default CalculatorKeypad
