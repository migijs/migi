var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.elementPresent('#test p')
      .assert.containsText('#test strong', '1')
  },
  'add1': function(browser) {
    browser
      .click('#test p[ref="add"]')
      .assert.containsText('#test strong', '1')
  },
  'add2': function(browser) {
    browser
      .click('#test p[ref="add"]')
      .assert.containsText('#test strong', '2')
  },
  'add3': function(browser) {
    browser
      .click('#test p[ref="add"]')
      .assert.containsText('#test strong', '3')
  },
  'del1': function(browser) {
    browser
      .click('#test p[ref="del"]')
      .assert.containsText('#test strong', '2')
  },
  'del2': function(browser) {
    browser
      .click('#test p[ref="del"]')
      .assert.containsText('#test strong', '1')
  },
  'del3': function(browser) {
    browser
      .click('#test p[ref="del"]')
      .assert.containsText('#test strong', '1')
      .end()
  }
};