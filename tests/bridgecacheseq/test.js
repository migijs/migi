var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.containsText('#test div[migi-uid="5"]', '1')
      .assert.containsText('#test div[migi-uid="6"]', '2')
      .assert.containsText('#test div[migi-uid="7"]', '4')
      .assert.containsText('#test div[migi-uid="8"]', '4')
      .end();
  }
};