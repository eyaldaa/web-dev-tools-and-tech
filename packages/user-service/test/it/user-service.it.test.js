'use strict'
const {promisify: p} = require('util')
const path = require('path')
const {describe, it, before, after} = require('mocha')
const {expect} = require('chai')
const fetch = require('node-fetch')
const redis = require('redis')
const {dockerComposeTool, getAddressForService} = require('docker-compose-mocha')

const app = require('../..')

describe('user-service it', function() {
  this.retries(global.v8debug || /--inspect/.test(process.execArgv.join(' ')) ? 0 : 3)

  const composePath = path.join(__dirname, 'docker-compose.yml')
  const envName = dockerComposeTool(before, after, composePath, {
    shouldPullImages: !!process.env.NODE_ENV && process.env.NODE_ENV !== 'development',
    brutallyKill: true,
    healthCheck: {
      state: true,
      options: {
        custom: {
          redis: url =>
            new Promise((resolve, reject) => {
              const client = new redis.createClient({url: `//${url}`})
                .on('error', err => {
                  client.end(false)
                  reject(err)
                })
                .on('ready', () => {
                  client.end(false)
                  resolve(true)
                })
            }),
        },
      },
    },
  })

  const {baseUrl} = setupApp(app, envName, composePath)

  let userId
  before(
    async () => ({userId} = await signupUser('good name', 'email@example.com', 'great-password')),
  )

  describe('signup and authentication', function() {
    it.only('should return OK on /', async () => {
      const response = await fetch(`${baseUrl()}/`)

      expect(response.status).to.equal(200)
      expect(await response.text()).to.equal('OK')
    })

    it('should authenticate signed up user', async () => {
      const authenticated = await authenticateUser('email@example.com', 'great-password')

      expect(authenticated).to.be.true
    })

    it('should not authenticate unknown user', async () => {
      const random = ((Math.random() * 100000) | 0).toString()
      const authenticated = await authenticateUser(`email-${random}@example.com`, 'great-password')

      expect(authenticated).to.be.false
    })

    it('should not authenticate user with different password', async () => {
      const authenticated = await authenticateUser(`email@example.com`, 'wrong-password')

      expect(authenticated).to.be.false
    })
  })

  async function signupUser(name, email, password) {
    const response = await fetch(`${baseUrl()}/signup`, {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify({email, name, password}),
    })

    expect(response.status).to.equal(200)

    return await response.json()
  }

  async function authenticateUser(email, password) {
    const response = await fetch(
      `${baseUrl()}/signup?email=${encodeURI(email)}&password=${encodeURI(password)}`,
    )

    expect(response.status).to.be.oneOf([200, 401])

    return response.status === 200
  }
})

function setupApp(app, envName, composePath) {
  let server
  let appInstance

  before(async () => {
    const configuration = {
      redisAddress: await getAddressForService(envName, composePath, 'redis', 6379),
    }

    await new Promise((resolve, reject) => {
      appInstance = app(configuration)
      server = appInstance.listen(err => (err ? reject(err) : resolve()))
    })
  })
  after(done => {
    appInstance.dispose().then(() => server.close(done), () => server.close(done))
  })

  return {
    baseUrl: () => `http://localhost:${server.address().port}`,
    address: () => `localhost:${server.address().port}`,
  }
}
