var path = require('path');
var fs = require('fs');

module.exports = {
  'bidirectional': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.value('#test input', 'Hello!')
      .assert.elementPresent('#test p')
      .assert.containsText('#test p', 'Hello!')
      .clearValue('#test input')
      .setValue('#test input', '123')
      .assert.containsText('#test p', '123')
      .end();
  }
};