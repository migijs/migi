var path = require('path');
var fs = require('fs');

module.exports = {
  'bridge both': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.containsText('#test [migi-uid="3"]', 'from a')
      .assert.containsText('#test [migi-uid="4"]', 'from a')
      .end()
  }
};