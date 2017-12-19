'use strict'
const {describe, it, before, after} = require('mocha')
const {expect} = require('chai')
const fetch = require('node-fetch')

const app = require('../..')

describe('currency-backend it', function() {
  this.retries(global.v8debug || /--inspect/.test(process.execArgv.join(' ')) ? 0 : 3)

  const {address} = setupApp(app)

  it('should return OK on /', async () => {
    const response = await fetch(`http://${address()}/`)

    expect(response.status).to.equal(200)
    expect(await response.text()).to.equal('OK')
  })

  it('should return a correct list of currencies', async () => {
    const response = await fetch(`http://${address()}/currencies`)

    expect(response.status).to.equal(200)
    expect(await response.json()).to.eql([
      'AUD',
      'BGN',
      'BRL',
      'CAD',
      'CHF',
      'CNY',
      'CZK',
      'DKK',
      'GBP',
      'HKD',
      'HRK',
      'HUF',
      'IDR',
      'ILS',
      'INR',
      'JPY',
      'KRW',
      'MXN',
      'MYR',
      'NOK',
      'NZD',
      'PHP',
      'PLN',
      'RON',
      'RUB',
      'SEK',
      'SGD',
      'THB',
      'TRY',
      'USD',
      'ZAR',
    ])
  })

  it('should return a correct list of rates', async () => {
    const response = await fetch(
      `http://${address()}/rates?base=ILS&date=2010-10-10&symbols=EUR,USD`,
    )

    expect(response.status).to.equal(200)
    expect(await response.json()).to.eql({
      EUR: 0.24176,
      USD: 0.28583,
    })
  })
})

function setupApp(app) {
  let server

  before(async () => {
    const configuration = {}

    await new Promise((resolve, reject) => {
      server = app(configuration).listen(err => (err ? reject(err) : resolve()))
    })
  })
  after(done => server.close(done))

  return {
    baseUrl: () => `http://localhost:${server.address().port}`,
    address: () => `localhost:${server.address().port}`,
  }
}
