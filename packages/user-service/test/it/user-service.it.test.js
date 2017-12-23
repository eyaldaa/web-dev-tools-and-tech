'use strict'
const {promisify: p} = require('util')
const path = require('path')
const {describe, it, before, after} = require('mocha')
const {expect} = require('chai')
const redis = require('redis')
const fetch = require('node-fetch')
const {dockerComposeTool, getAddressForService} = require('docker-compose-mocha')
const {signupUser, authenticateUser} = require('../common/common')

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
    async () =>
      ({userId} = await signupUser(baseUrl(), 'good name', 'email@example.com', 'great-password')),
  )

  it('should return OK on /', async () => {
    console.log(`@@@GIL sdfsdf`)
    const response = await fetch(`${baseUrl()}/`)

    expect(response.status).to.equal(200)
    expect(await response.text()).to.equal('OK')
  })

  describe('signup and authentication', function() {
    it('should authenticate signed up user', async () => {
      const authenticated = await authenticateUser(baseUrl(), 'email@example.com', 'great-password')

      expect(authenticated).to.be.true
    })

    it('should not authenticate unknown user', async () => {
      const random = ((Math.random() * 100000) | 0).toString()
      const authenticated = await authenticateUser(
        baseUrl(),
        `email-${random}@example.com`,
        'great-password',
      )

      expect(authenticated).to.be.false
    })

    it('should not authenticate user with different password', async () => {
      const authenticated = await authenticateUser(baseUrl(), `email@example.com`, 'wrong-password')

      expect(authenticated).to.be.false
    })
  })
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
