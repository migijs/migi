var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.elementPresent('#test p')
      .assert.elementPresent('#test [ref="span"]')
      .assert.elementPresent('#test2')
      .click('#test [ref="span"]')
      .assert.containsText('#test2', '0')
      .click('#test [ref="span"]')
      .assert.containsText('#test2', '1')
  },
  'clean': function(browser) {
    browser
      .click('#test p')
      .click('#test [ref="span"]')
      .assert.containsText('#test2', '1')
      .end();
  }
};