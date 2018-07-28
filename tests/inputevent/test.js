var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.elementPresent('#test2');
  },
  'input': function(browser) {
    browser
      .setValue('input', 'a')
      .assert.containsText('#test2', '1a')
      .end();
  },
};