var path = require('path');
var fs = require('fs');

module.exports = {
  'encode': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.elementPresent('#test p')
      .assert.elementPresent('#test p strong')
      .assert.containsText('#test p strong', '使用html')
      .assert.elementPresent('#test p:last-child')
      .assert.elementPresent('#test p:last-child strong')
      .assert.containsText('#test p:last-child strong', '再次使用html')
      .end();
  }
};