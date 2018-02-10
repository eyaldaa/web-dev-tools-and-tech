'use strict'
const express = require('express')

function makeWebApp(store) {
  const app = express()

  app.post('/calculate', 1)
  app.post('/history', 2)
}

module.exports = makeWebApp
