#!/usr/bin/env node
'use strict'

const webApp = require('../')

const configuration = {}

const server = webApp(configuration).listen(process.env.PORT || 3000, err => {
  if (err) {
    return console.error(err)
  }
  console.log(`Listening on port ${server.address().port}`)
})
