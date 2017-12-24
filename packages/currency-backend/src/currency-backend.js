'use strict'
const express = require('express')
const fetch = require('node-fetch')
const passport = require('passport')
const flash = require('connect-flash')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const session = require('express-session')
const connectRedis = require('connect-redis')
const authenticationRoutes = require('./auth-routes')

function createApp({redisAddress, sessionSecret, userServiceAddress}) {
  let cachedSymbols

  const app = express()

  app.set('etag', false)
  app.use(cookieParser())
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({extended: true}))

  app.set('view engine', 'ejs')

  const RedisStore = connectRedis(session)
  app.use(
    session({
      secret: sessionSecret,
      store: new RedisStore({url: `//${redisAddress}`}),
    }),
  )
  app.use(passport.initialize())
  app.use(passport.session())
  app.use(flash())

  app.get('/', (req, res) => res.send('OK'))

  authenticationRoutes(app, passport, userServiceAddress, onlyIfLoggedIn)

  app.get('/currencies', onlyIfLoggedIn, async (req, res) => {
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

  app.get('/rates', onlyIfLoggedIn, async (req, res) => {
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

  function onlyIfLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next()

    res.redirect('/')
  }

  function onlyIfLoggedInAjax(req, res, next) {
    if (req.isAuthenticated()) return next()

    res.status(401).send('')
  }

  return app
}

function onlyIfLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next()

  res.redirect('/')
}

module.exports = createApp
