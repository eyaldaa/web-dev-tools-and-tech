'use strict'
const express = require('express')
const fetch = require('node-fetch')

function createApp() {
  const app = express()

  let cachedSymbols

  app.set('etag', false)

  app.get('/', (req, res) => res.send('OK'))

  app.get('/currencies', async (req, res) => {
    if (cachedSymbols) return res.send(cachedSymbols)

    try {
      const response = await fetch('https://api.fixer.io/latest')

      if (!response.ok) return res.status(500).send('')

      const ratesResponse = await response.json()

      cachedSymbols = Object.keys(ratesResponse.rates)

      return res.json(cachedSymbols)
    } catch (err) {
      return res.status(500).send(err.stack || err)
    }
  })

  app.get('/rates', async (req, res) => {
    const base = req.query.base || 'USD'
    const symbols = req.query.symbols
    const date = req.date || 'latest'

    try {
      const response = await fetch(`https://api.fixer.io/${date}?symbols=${symbols}&base=${base}`)

      if (!response.ok) return res.status(500).send('')

      const ratesResponse = await response.json()

      return res.json(ratesResponse.rates)
    } catch (err) {
      return res.status(500).send(err.stack || err)
    }
  })

  return app
}

module.exports = createApp
