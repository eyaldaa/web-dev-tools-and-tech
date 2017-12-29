'use strict'
const {describe, it, before, after} = require('mocha')
const {expect} = require('chai')
const fetch = require('node-fetch')

const app = require('../..')

describe('currency-calculator it', function() {
  this.retries(global.v8debug || /--inspect/.test(process.execArgv.join(' ')) ? 0 : 3)

  const {baseUrl} = setupApp()

  it('should return OK on /', async () => {
    const response = await fetch(`${baseUrl()}/`)

    expect(response.status).to.equal(200)
    expect(await response.text()).to.equal('OK')
  })

  it('should do a calculation correctly', async () => {
    let nextState
    nextState = await fetchNextCalcState(null, '2', {EUR: 2})
    expect(nextState.display).to.equal('2')
    nextState = await fetchNextCalcState(nextState, '1')
    expect(nextState.display).to.equal('21')
    nextState = await fetchNextCalcState(nextState, 'EUR')
    expect(nextState.display).to.equal('42')
    nextState = await fetchNextCalcState(nextState, '+')
    expect(nextState.display).to.equal('42')
    nextState = await fetchNextCalcState(nextState, '+')
    expect(nextState.display).to.equal('42')
    nextState = await fetchNextCalcState(nextState, '2')
    expect(nextState.display).to.equal('2')
    nextState = await fetchNextCalcState(nextState, '=')
    expect(nextState.display).to.equal('44')
  })
  async function fetchNextCalcState(calculatorState, input, rates) {
    const response = await fetch(`${baseUrl()}/calculate`, {
      method: 'POST',
      body: JSON.stringify({rates, calculatorState, input}),
      headers: {'Content-Type': 'application/json'},
    })
    expect(response.status).to.equal(200)

    return await response.json()
  }
})

function setupApp() {
  let server

  before(async () => {
    await new Promise((resolve, reject) => {
      server = app({}).listen(err => (err ? reject(err) : resolve()))
    })
  })
  after(done => server.close(done))

  return {
    baseUrl: () => `http://localhost:${server.address().port}`,
    address: () => `localhost:${server.address().port}`,
  }
}
