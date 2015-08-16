var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.elementPresent('#test p')
      .assert.elementPresent('#test span')
      .assert.elementPresent('#test strong')
      .assert.containsText('#test p', '0')
      .assert.containsText('#test span', '0')
      .assert.containsText('#test strong', '0')
      .end();
  }
};