var path = require('path');
var fs = require('fs');

module.exports = {
  'find class': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.containsText('#test span', 'txt')
      .assert.containsText('#test2', 'true')
      .end()
  }
};