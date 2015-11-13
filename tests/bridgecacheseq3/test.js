var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.containsText('#test div[migi-uid="7"]', '1')
      .assert.containsText('#test div[migi-uid="8"]', '2')
      .assert.containsText('#test div[migi-uid="9"]', '2')
      .assert.containsText('#test div[migi-uid="10"]', '1')
      .assert.containsText('#test div[migi-uid="11"]', '1')
      .assert.containsText('#test div[migi-uid="12"]', '1')
      .end();
  }
};