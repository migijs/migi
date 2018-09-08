var path = require('path');
var fs = require('fs');

module.exports = {
  'component with one param': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.elementPresent('#test p')
      .assert.containsText('#test p', 'a')
      .end();
  },
};