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

    await driver.wait(until.elementLocated(By.css('h1')))

    expect(await (await driver.findElement(By.css('h1'))).getText()).to.equal('todos')

    const addElement = await driver.findElement(By.css('.new-todo'))

    await addElement.sendKeys('Cook!', Key.ENTER)
    await addElement.sendKeys('Clean!', Key.ENTER)

    await driver.wait(until.elementLocated(By.css('.todo-list :nth-child(2) label')))

    const secondTodo = await driver.findElement(By.css('.todo-list :nth-child(2) label'))
    expect(await secondTodo.getText()).to.equal('Clean!')

    const secondTodoCompleted = await driver.findElement(By.css('.todo-list :nth-child(2) input[type="checkbox"]'))

    await secondTodoCompleted.click()

    await (await driver.findElement(By.linkText('Completed'))).click()

    await driver.wait(until.elementLocated(By.css('.todo-list :nth-child(1) label')))

    const firstTodo = await driver.findElement(By.css('.todo-list :nth-child(1) label'))
    expect(await firstTodo.getText()).to.equal('Clean!')
  })
})
