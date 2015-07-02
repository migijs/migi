var path = require('path');
var fs = require('fs');

module.exports = {
  'bridge': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.elementPresent('#test span[migi-uid="4"]')
      .assert.containsText('#test span[migi-uid="4"]', '123')
      .assert.elementPresent('#test span[migi-uid="5"]')
      .assert.containsText('#test span[migi-uid="5"]', '123')
      .assert.elementPresent('#test span[migi-uid="6"]')
      .assert.containsText('#test span[migi-uid="6"]', '123')
      .end();
  }
};