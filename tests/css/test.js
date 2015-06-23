var path = require('path');
var fs = require('fs');

module.exports = {
  'simple': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.elementPresent('#test div')
      .assert.cssProperty('#test div', 'margin', '0px')
  },
  'child': function(browser) {
    browser
      .assert.elementPresent('#test p:first-child')
      .assert.cssProperty('#test p:first-child', 'margin', '1px')
  },
  'child recursion': function(browser) {
    browser
      .assert.elementPresent('#test p span')
      .assert.cssProperty('#test p span', 'padding', '0px')
  },
  'class': function(browser) {
    browser
      .assert.elementPresent('#test [migi-class="txt"]')
      .assert.cssProperty('#test [migi-class="txt"]', 'padding', '3px')
  },
  'name with class': function(browser) {
    browser
      .assert.elementPresent('#test strong[migi-class="txt"]')
      .assert.cssProperty('#test strong[migi-class="txt"]', 'padding', '2px')
      .assert.cssProperty('#test strong[migi-class="txt"]', 'font-size', '12px')
  },
  'id with class': function(browser) {
    browser
      .assert.elementPresent('#test [migi-id="sp"]')
      .assert.cssProperty('#test [migi-id="sp"]', 'padding', '4px')
  },
  'toggle': function(browser) {
    browser
      .click('#test p')
      .assert.cssProperty('#test div', 'margin', '1px')
  },
  'toggle child': function(browser) {
    browser
      .assert.elementPresent('#test p:first-child')
      .assert.cssProperty('#test p:first-child', 'margin', '2px')
  },
  'toggle child recursion': function(browser) {
    browser
      .assert.elementPresent('#test p span')
      .assert.cssProperty('#test p span', 'padding', '1px')
  },
  'toggle class': function(browser) {
    browser
      .assert.elementPresent('#test [migi-class="txt"]')
      .assert.cssProperty('#test [migi-class="txt"]', 'padding', '7px')
  },
  'toggle name with class': function(browser) {
    browser
      .assert.elementPresent('#test strong[migi-class="txt"]')
      .assert.cssProperty('#test strong[migi-class="txt"]', 'padding', '7px')
      .assert.cssProperty('#test strong[migi-class="txt"]', 'font-size', '12px')
      .assert.cssProperty('#test strong[migi-class="txt"]', 'margin', '0px')
  },
  'toggle id with class': function(browser) {
    browser
      .assert.elementPresent('#test [migi-id="sp"]')
      .assert.cssProperty('#test [migi-id="sp"]', 'padding', '8px')
      .end()
  }
};