'use strict'

const calculatePolish = require('../src/calculate')

if (calculatePolish([]) !== undefined) throw new Error()

if (calculatePolish([3, 4, 5]) !== 5) throw new Error()

if (calculatePolish([3, 4, '+']) !== 7) throw new Error()

if (calculatePolish([3, 4, '-']) !== -1) throw new Error()

if (calculatePolish([3, 4, '*']) !== 12) throw new Error()

if (calculatePolish([10, 5, '/']) !== 2) throw new Error()

if (calculatePolish([11, 5, 8, 4,  '/', '*', '+']) !== 21) throw new Error()
