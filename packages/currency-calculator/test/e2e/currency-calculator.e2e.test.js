'use strict'
const path = require('path')
const {describe, it, before, after} = require('mocha')
const {expect} = require('chai')
const fetch = require('node-fetch')
const {dockerComposeTool} = require('docker-compose-mocha')
const {getAddressForService} = require('@applitools/docker-compose-testkit')

describe('currency-calculator e2e', function() {
  this.retries(global.v8debug || /--inspect/.test(process.execArgv.join(' ')) ? 0 : 3)

  const composePath = path.join(__dirname, 'docker-compose.yml')
  const envName = dockerComposeTool(before, after, composePath, {
    shouldPullImages: !!process.env.NODE_ENV && process.env.NODE_ENV !== 'development',
    brutallyKill: true,
  })

  it('should return OK on /', async () => {
    const appAddress = await getAddressForService(envName, composePath, 'app', 80)

    const response = await fetch(`http://${appAddress}/`)

    expect(response.status).to.equal(200)
    expect(await response.text()).to.equal('OK')
  })

  it('should do a calculation correctly', async () => {
    const appAddress = await getAddressForService(envName, composePath, 'app', 80)

    let nextState
    nextState = await fetchNextCalcState(appAddress, null, '2', {EUR: 2})
    expect(nextState.display).to.equal('2')
    nextState = await fetchNextCalcState(appAddress, nextState, '1')
    expect(nextState.display).to.equal('21')
    nextState = await fetchNextCalcState(appAddress, nextState, 'EUR')
    expect(nextState.display).to.equal('42')
    nextState = await fetchNextCalcState(appAddress, nextState, '+')
    expect(nextState.display).to.equal('42')
    nextState = await fetchNextCalcState(appAddress, nextState, '+')
    expect(nextState.display).to.equal('42')
    nextState = await fetchNextCalcState(appAddress, nextState, '2')
    expect(nextState.display).to.equal('2')
    nextState = await fetchNextCalcState(appAddress, nextState, '=')
    expect(nextState.display).to.equal('44')
  })

  async function fetchNextCalcState(appAddress, calculatorState, input, rates) {
    const response = await fetch(`http://${appAddress}/calculate`, {
      method: 'POST',
      body: JSON.stringify({rates, calculatorState, input}),
      headers: {'Content-Type': 'application/json'},
    })
    expect(response.status).to.equal(200)

    return await response.json()
  }
})
