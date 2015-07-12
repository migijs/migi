var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.elementPresent('#record1')
      .assert.containsText('#record', '1')
      .assert.elementNotPresent('#record2')
      .end();
  }
};