var path = require('path');
var fs = require('fs');

module.exports = {
  'encode': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.elementPresent('#test strong')
      .assert.containsText('#test strong', '使用html')
      .end();
  }
};