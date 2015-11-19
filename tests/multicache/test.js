var path = require('path');
var fs = require('fs');

module.exports = {
  'multicache': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.elementPresent('#test p')
      .assert.cssClassPresent('#test p', 'a')
      .assert.containsText('#test p', 'b')
      .end();
  }
};