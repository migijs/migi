var path = require('path');
var fs = require('fs');

module.exports = {
  'init empty': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.elementPresent('#test div span')
  },
  'click': function(browser) {
    browser
      .click('#test div p')
      .assert.elementPresent('#test div span')
      .assert.containsText('#test div span', '1')
      .assert.containsText('#test2', '^1$')
  },
  'click2': function(browser) {
    browser
      .click('#test div p')
      .assert.elementPresent('#test div span')
      .assert.containsText('#test div span', '')
      .assert.containsText('#test2', '^1$')
  },
  'click3': function(browser) {
    browser
      .click('#test>div>p')
      .assert.elementPresent('#test div b')
      .assert.containsText('#test div b', '2')
      .assert.containsText('#test2', '^1$')
  },
  'click4': function(browser) {
    browser
      .click('#test>div>p')
      .assert.elementPresent('#test div span')
      .assert.containsText('#test div span', '')
      .assert.containsText('#test2', '^1$')
  },
  'click5': function(browser) {
    browser
      .click('#test>div>p')
      .assert.elementPresent('#test div b')
      .assert.containsText('#test div b', '3')
      .assert.containsText('#test2', '^1$')
  },
  'click6': function(browser) {
    browser
      .click('#test>div>p')
      .assert.elementPresent('#test div small')
      .assert.containsText('#test div small', '1')
      .assert.containsText('#test2', '^1$')
  },
  'click7': function(browser) {
    browser
      .click('#test>div>p')
      .assert.elementPresent('#test div span')
      .assert.containsText('#test div span', '2')
      .assert.containsText('#test2', '^1$')
      .end()
  }
};