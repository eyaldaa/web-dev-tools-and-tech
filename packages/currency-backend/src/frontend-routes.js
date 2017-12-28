'use strict'
const proxy = require('express-http-proxy')

function frontendRoutes(app, frontendAdress, onlyIfLoggedIn) {
  app.get(
    '/currency',
    onlyIfLoggedIn,
    proxy(frontendAdress, {
      proxyReqPathResolver(req) {
        return req.url === '/currency' ? '/' : req.url
      },
    }),
  )
  app.get(/\./, onlyIfLoggedIn, proxy(frontendAdress))
}

module.exports = frontendRoutes
