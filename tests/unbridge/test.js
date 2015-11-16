var path = require('path');
var fs = require('fs');

module.exports = {
  'bridge': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.elementPresent('#test span[migi-uid="3"]')
      .assert.containsText('#test span[migi-uid="3"]', 'txt')
      .assert.elementPresent('#test span[migi-uid="4"]')
      .assert.containsText('#test span[migi-uid="4"]', '')
      .end();
  }
};