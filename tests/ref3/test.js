var path = require('path');
var fs = require('fs');

module.exports = {
  'ref': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.elementPresent('#test p')
      .assert.containsText('#test p', 'empty')
      .click('#test strong')
      .assert.containsText('#test p', 'yes')
      .click('#test strong')
      .assert.containsText('#test p', 'no')
      .click('#test strong')
      .assert.containsText('#test p', 'yes')
      .click('#test strong')
      .assert.containsText('#test p', 'no')
      .end();
  }
};