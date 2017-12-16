'use strict'
const express = require('express')

module.exports = createApp

function createApp() {
  const app = express()

  app.set('etag', false)

  app.get('/', (req, res) => res.send('OK'))
}

