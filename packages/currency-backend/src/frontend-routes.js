'use strict'
const proxy = require('express-http-proxy')

function frontendRoutes(app, frontendAdress, onlyIfLoggedIn) {
  app.get(
    '/currency',
    onlyIfLoggedIn,
    proxy(frontendAdress, {
      proxyReqPathResolver() {
        return '/'
      },
      userResDecorator(_, data) {
        return (
          `
<script>window.useCurrencyBackend = true</script>
        ` + data.toString().replace(/(href|src)="/gi, `$1="//${frontendAdress}`)
        )
      },
    }),
  )
}

module.exports = frontendRoutes
