var path = require('path');
var fs = require('fs');

module.exports = {
  'normal': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.elementPresent('#test a[ref="0"]')
      .assert.cssProperty('#test a[ref="0"]', 'padding', '0px')
  },
  'only has': function(browser) {
    browser
      .assert.elementPresent('#test a[ref="1"]')
      .assert.cssProperty('#test a[ref="1"]', 'padding', '1px')
  },
  '!=': function(browser) {
    browser
      .assert.elementPresent('#test a[ref="2"]')
      .assert.cssProperty('#test a[ref="2"]', 'padding', '1px')
  },
  '=': function(browser) {
    browser
      .assert.elementPresent('#test a[ref="3"]')
      .assert.cssProperty('#test a[ref="3"]', 'padding', '2px')
  },
  '^=': function(browser) {
    browser
      .assert.elementPresent('#test a[ref="4"]')
      .assert.cssProperty('#test a[ref="4"]', 'padding', '3px')
  },
  '$=': function(browser) {
    browser
      .assert.elementPresent('#test a[ref="5"]')
      .assert.cssProperty('#test a[ref="5"]', 'padding', '4px')
  },
  '~=': function(browser) {
    browser
      .assert.elementPresent('#test a[ref="6"]')
      .assert.cssProperty('#test a[ref="6"]', 'padding', '5px')
  },
  '*=': function(browser) {
    browser
      .assert.elementPresent('#test a[ref="7"]')
      .assert.cssProperty('#test a[ref="7"]', 'padding', '7px')
  },
  '|=': function(browser) {
    browser
      .assert.elementPresent('#test a[ref="8"]')
      .assert.cssProperty('#test a[ref="8"]', 'padding', '6px')
      .end()
  }
};