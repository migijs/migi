var path = require('path');
var fs = require('fs');

module.exports = {
  'flush': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.elementPresent('#test p')
      .assert.containsText('#test p', 'count: 100000')
      .assert.containsText('#test2', '2')
      .end();
  }
};