var path = require('path');
var fs = require('fs');

module.exports = {
  'init empty': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.elementPresent('#test div')
  },
  'click': function(browser) {
    browser
      .click('#test div p')
      .assert.elementPresent('#test div span')
      .assert.containsText('#test div span', '1')
  },
  'click2': function(browser) {
    browser
      .click('#test div p')
      .assert.elementPresent('#test div span')
      .assert.containsText('#test div span', '2')
  },
  'click3': function(browser) {
    browser
      .click('#test>div>p')
      .assert.elementPresent('#test div b')
      .assert.containsText('#test div b', '3')
      .end()
  },
  'click4': function(browser) {
    browser
      .click('#test>div>p')
      .assert.elementPresent('#test div div')
      .assert.elementPresent('#test div div span')
      .assert.containsText('#test div div span', '4')
      .end()
  },
  'click5': function(browser) {
    browser
      .click('#test>div>p')
      .assert.elementPresent('#test div span')
      .assert.containsText('#test div span', '5')
      .end()
  }
};