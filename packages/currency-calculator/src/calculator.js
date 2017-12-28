const initialState = currencyConversions => ({display: '0', initial: true, currencyConversions})

const nextState = (calculatorState, input) => {
  if (isDigit(input)) {
    return addDigit(calculatorState, input)
  } else if (isOperator(input)) {
    return addOperator(calculatorState, input)
  } else if (isEqualSign(input)) {
    return compute(calculatorState)
  } else if (isRate(calculatorState, input)) {
    return {
      ...calculatorState,
      initial: true,
      display: String(
        calculatorState.currencyConversions[input] * parseInt(calculatorState.display, 10),
      ),
    }
  } else {
    return calculatorState
  }
}

const isRate = (calculatorState, character) =>
  Object.keys(calculatorState.currencyConversions).includes(character)

const isDigit = character => character >= '0' && character <= '9'

const isOperator = character => !!OPERATORS[character]

const isEqualSign = character => character === '='

const addDigit = (calculatorState, character) => {
  if (calculatorState.initial) {
    return Object.assign({}, calculatorState, {
      display: character,
      initial: false,
      previousOperand: parseInt(calculatorState.display),
    })
  } else {
    return Object.assign({}, calculatorState, {display: calculatorState.display + character})
  }
}

const addOperator = (calculatorState, character) => {
  if (!calculatorState.operator || calculatorState.initial) {
    return Object.assign({}, calculatorState, {operator: character, initial: true})
  } else {
    return Object.assign({}, compute(calculatorState), {operator: character})
  }
}

const compute = calculatorState =>
  !calculatorState.operator
    ? Object.assign({}, calculatorState, {initial: true})
    : {
        display: String(
          OPERATORS[calculatorState.operator](
            calculatorState.previousOperand,
            parseInt(calculatorState.display, 10),
          ),
        ),
        initial: true,
      }

const OPERATORS = {
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
  '*': (a, b) => a * b,
  '/': (a, b) => a / b,
}

module.exports = {
  initialState,
  nextState,
}
