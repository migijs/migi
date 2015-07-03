var path = require('path');
var fs = require('fs');

module.exports = {
  'bridge type': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.containsText('#test [migi-uid="9"]', 'txt')
      .assert.containsText('#test [migi-uid="10"]', 'txttxt')
      .assert.containsText('#test [migi-uid="11"]', 'txt')
      .assert.containsText('#test [migi-uid="12"]', 'txt')
      .assert.containsText('#test [migi-uid="13"]', 'txt')
      .assert.containsText('#test [migi-uid="14"]', 'txt')
      .assert.containsText('#test [migi-uid="15"]', 'txt')
      .assert.containsText('#test [migi-uid="16"]', 'txttxttxt')
      .end()
  }
};