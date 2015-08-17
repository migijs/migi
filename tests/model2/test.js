var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.elementPresent('#test p[migi-uid="4"]')
      .assert.elementPresent('#test p[migi-uid="5"]')
      .assert.elementPresent('#test p[migi-uid="6"]')
      .assert.containsText('#test p[migi-uid="4"]', '1')
      .assert.containsText('#test p[migi-uid="5"]', '1')
      .assert.containsText('#test p[migi-uid="6"]', '1')
      .end();
  }
};