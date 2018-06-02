'use strict'
const {describe, it, before, after} = require('mocha')
const {expect} = require('chai')
const webdriver = require('selenium-webdriver')
require('chromedriver')
// require('geckodriver')
const {By, Key, until} = webdriver

describe('sample web app', function() {
  before(() => {/* Run application */})
  after(() => {/* Close application*/})

  let driver
  before(
    () =>
      (driver = new webdriver.Builder()
        .forBrowser('chrome')
        .build()),
  )
  after(async () => await driver.quit())

  it('happy path', async () => {
    await driver.get(`http://todomvc.com/examples/react/#/`)

    console.log(`@@@GIL 1`)
    await driver.wait(until.elementLocated(By.css('h1')))

    console.log(`@@@GIL 1`)
    expect(await (await driver.findElement(By.css('h1'))).getText()).to.equal('todos')

    console.log(`@@@GIL 1`)
    const addElement = await driver.findElement(By.css('.new-todo'))

    console.log(`@@@GIL 1`)
    await addElement.sendKeys('Cook!', Key.ENTER)
    await addElement.sendKeys('Clean!', Key.ENTER)

    console.log(`@@@GIL 1`)
    await driver.wait(until.elementLocated(By.css('.todo-list :nth-child(2) label')))

    console.log(`@@@GIL 1`)
    const secondTodo = await driver.findElement(By.css('.todo-list :nth-child(2) label'))
    expect(await secondTodo.getText()).to.equal('Clean!')

    console.log(`@@@GIL 1`)
    const secondTodoCompleted = await driver.findElement(By.css('.todo-list :nth-child(2) input[type="checkbox"]'))

    console.log(`@@@GIL 1`)
    await secondTodoCompleted.click()

    console.log(`@@@GIL 1`)
    await (await driver.findElement(By.linkText('Completed'))).click()

    console.log(`@@@GIL 1`)
    await driver.wait(until.elementLocated(By.css('.todo-list :nth-child(1) label')))

    const firstTodo = await driver.findElement(By.css('.todo-list :nth-child(1) label'))
    expect(await firstTodo.getText()).to.equal('Clean!')
  })
})
