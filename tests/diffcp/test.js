var path = require('path');
var fs = require('fs');

module.exports = {
  'init empty': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.elementPresent('#test [migi-name="Component"]')
      .assert.elementPresent('#test [ref="0"]')
      .assert.elementPresent('#test [ref="1"]')
  },
  'empty 2 cp2': function(browser) {
    browser
      .click('#test p[ref="0"]')
      .assert.elementPresent('#test [ref="1"]')
      .assert.elementPresent('#test [ref="2"]')
      .assert.elementPresent('#test [ref="3"]')
      .assert.elementPresent('#test [migi-name="Component2"]')
      .assert.containsText('#test [ref="3"]', 'c2')
  },
  'cp2 click': function(browser) {
    browser
      .click('#test p[ref="2"]')
      .assert.containsText('#test [ref="3"]', 'c22')
  },
  'cp2 2 cp2': function(browser) {
    browser
      .click('#test p[ref="0"]')
      .assert.elementPresent('#test [ref="1"]')
      .assert.elementPresent('#test [ref="2"]')
      .assert.elementPresent('#test [ref="3"]')
      .assert.elementPresent('#test [migi-name="Component2"]')
      .assert.containsText('#test [ref="3"]', 'c2')
  },
  'cp2 click again': function(browser) {
    browser
      .click('#test p[ref="2"]')
      .assert.containsText('#test [ref="3"]', 'c22')
  },
  'cp2 2 cp2 again': function(browser) {
    browser
      .click('#test p[ref="0"]')
      .assert.elementPresent('#test [ref="1"]')
      .assert.elementPresent('#test [ref="2"]')
      .assert.elementPresent('#test [ref="3"]')
      .assert.elementPresent('#test [migi-name="Component2"]')
      .assert.containsText('#test [ref="3"]', '234')
  },
  'cp2 click again2': function(browser) {
    browser
      .click('#test p[ref="2"]')
      .assert.containsText('#test [ref="3"]', 'c22')
  },
  'cp2 2 cp2 again2': function(browser) {
    browser
      .click('#test p[ref="0"]')
      .assert.elementPresent('#test [ref="1"]')
      .assert.elementPresent('#test [ref="2"]')
      .assert.elementPresent('#test [ref="3"]')
      .assert.elementPresent('#test [migi-name="Component2"]')
      .assert.containsText('#test [ref="3"]', 'c2')
  },
  'cp2 click again3': function(browser) {
    browser
      .click('#test p[ref="2"]')
      .assert.containsText('#test [ref="3"]', 'c22')
  },
  'cp2 2 cp3': function(browser) {
    browser
      .click('#test p[ref="0"]')
      .assert.elementPresent('#test [ref="1"]')
      .assert.elementPresent('#test [migi-name="Component3"]')
      .assert.elementPresent('#test [ref="4"]')
      .assert.elementPresent('#test [ref="5"]')
      .assert.containsText('#test [ref="5"]', 'c3')
  },
  'cp3 click': function(browser) {
    browser
      .click('#test p[ref="4"]')
      .assert.containsText('#test [ref="5"]', 'c33')
  },
  'cp3 2 cp2': function(browser) {
    browser
      .click('#test p[ref="0"]')
      .assert.elementPresent('#test [ref="1"]')
      .assert.elementPresent('#test [ref="2"]')
      .assert.elementPresent('#test [ref="3"]')
      .assert.elementPresent('#test [migi-name="Component2"]')
      .assert.containsText('#test [ref="3"]', 'c2')
  },
  'cp2 click again4': function(browser) {
    browser
      .click('#test p[ref="2"]')
      .assert.containsText('#test [ref="3"]', 'c22')
      .end()
  }
};