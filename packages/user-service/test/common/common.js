const fetch = require('node-fetch')
const {expect} = require('chai')

async function signupUser(baseUrl, name, email, password) {
  const response = await fetch(`${baseUrl}/signup`, {
    method: 'POST',
    headers: {'content-type': 'application/json'},
    body: JSON.stringify({email, name, password}),
  })

  expect(response.status).to.equal(200)

  return await response.json()
}

async function authenticateUser(baseUrl, email, password) {
  const response = await fetch(
    `${baseUrl}/authenticate?email=${encodeURI(email)}&password=${encodeURI(password)}`,
  )

  expect(response.status).to.be.oneOf([200, 401, 404])

  return response.status === 200
}

module.exports = {
  signupUser,
  authenticateUser,
}
