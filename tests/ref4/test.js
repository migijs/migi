var path = require('path');
var fs = require('fs');

module.exports = {
  'ref': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.elementPresent('#test')
      .assert.elementPresent('#test2')
      .assert.containsText('#test', 'Test,p,2')
      .end();
  }
};