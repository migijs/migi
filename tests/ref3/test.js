var path = require('path');
var fs = require('fs');

module.exports = {
  'ref': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.elementPresent('#test p')
      .assert.containsText('#test p', 'empty')
      .click('#test div')
      .assert.containsText('#test p', 'yes')
      .click('#test div')
      .assert.containsText('#test p', 'no')
      .click('#test div')
      .assert.containsText('#test p', 'yes')
      .click('#test div')
      .assert.containsText('#test p', 'no')
      .end();
  }
};