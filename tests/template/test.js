var path = require('path');
var fs = require('fs');

module.exports = {
  'template': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.elementPresent('#test')
      .assert.elementPresent('#test p')
      .assert.containsText('#test p', 'This is a template.')
      .assert.elementPresent('#test2')
      .assert.elementPresent('#test2 p')
      .assert.containsText('#test2 p', 'This is a template too.')
      .end();
  }
};