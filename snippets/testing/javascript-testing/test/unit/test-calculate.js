'use strict'
const {describe, it} = require('mocha')
const {expect} = require('chai')

const calculatePolish = require('../src/calculate')

describe('calculatePolish', function() {
  it('should return undefined on an empty stack', () => {
    expect(calculatePolish([])).to.be.undefined
  })

  it('should return TOS if only numbers ', () => {
    expect(calculatePolish([3, 4, 5])).to.equal(5)
  })

  it('should return sum calculation', () => {
    expect(calculatePolish([3, 4, '+'])).to.equal(7)
  })

  it('should return diff calculation', () => {
    expect(calculatePolish([3, 4, '-'])).to.equal(-1)
  })

  it('should return mult calculation', () => {
    expect(calculatePolish([3, 4, '*'])).to.equal(12)
  })

  it('should return div calculation', () => {
    expect(calculatePolish([10, 5, '/'])).to.equal(2)
  })

  it('should return multiple calculations', () => {
    expect(calculatePolish([11, 5, 8, 4,  '/', '*', '+'])).to.equal(21)
  })
})
