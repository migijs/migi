var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.elementPresent('#test [migi-name="Component"]')
  },
  'click': function(browser) {
    browser
      .click('#test p[ref="0"]')
      .pause(1000)
      .assert.containsText('#test [ref="1"]', '1')
  },
  'click2': function(browser) {
    browser
      .click('#test p[ref="0"]')
      .pause(1000)
      .assert.containsText('#test [ref="1"]', '3')
      .end()
  }
};