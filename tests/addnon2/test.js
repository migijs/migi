var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.elementPresent('#test p')
  },
  'add': function(browser) {
    browser
      .click('#test p[ref="add"]')
      .assert.containsText('#test strong', '0')
  },
  'replace': function(browser) {
    browser
      .click('#test p[ref="add"]')
      .assert.containsText('#test strong', '0')
      .end()
  }
};