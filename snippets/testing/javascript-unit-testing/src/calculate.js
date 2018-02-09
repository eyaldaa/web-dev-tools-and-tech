function calculatePolish(polish) {
  const stack = []

  for (const current of polish) {
    calculate(stack, current)
  }

  return stack.pop()
}

function calculate(stack, current) {
  if (typeof current === 'string') {
    const right = stack.pop()
    const left = stack.pop()
    switch (current) {
      case '+':
        stack.push(left + right)
        break
      case '-':
        stack.push(left - right)
        break
      case '*':
        stack.push(left * right)
        break
      case '/':
        stack.push(left / right)
        break
    }
  } else {
    stack.push(current)
  }
}

module.exports = calculatePolish
