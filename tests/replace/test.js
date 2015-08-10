var path = require('path');
var fs = require('fs');

module.exports = {
  'ref': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.containsText('#test p[migi-uid="5"]', '3')
      .assert.containsText('#test p[migi-uid="6"]', '2')
      .end();
  }
};