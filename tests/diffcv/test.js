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
      .assert.elementPresent('#test div div')
  },
  'click3': function(browser) {
    browser
      .click('#test>div>p')
      .assert.elementPresent('#test div span')
      .assert.containsText('#test div span', '2')
      .end()
  }
};