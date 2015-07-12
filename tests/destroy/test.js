var path = require('path');
var fs = require('fs');

module.exports = {
  'destroy': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.containsText('#test p', '1')
      .end()
  }
};