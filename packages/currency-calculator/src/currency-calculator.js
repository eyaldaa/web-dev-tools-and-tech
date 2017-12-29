'use strict'
const express = require('express')
const bodyParser = require('body-parser')

const {initialState, nextState} = require('./calculator')

module.exports = createApp

function createApp() {
  const app = express()

  app.set('etag', false)

  app.get('/', (req, res) => res.send('OK'))

  app.post('/calculate', bodyParser.json(), (req, res) => {
    const {calculatorState, input, rates} = req.body

    res.json(nextState(calculatorState || initialState(rates), input))
  })

  return app
}
