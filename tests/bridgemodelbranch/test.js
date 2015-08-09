var path = require('path');
var fs = require('fs');

module.exports = {
  'bridge model': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.containsText('#test p[migi-name="Component"]', '1')
      .assert.containsText('#test p[migi-name="Component2"]', '1')
      .assert.containsText('#test p[migi-name="Component3"]', '2')
      .end()
  }
};