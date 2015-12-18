var path = require('path');
var fs = require('fs');

module.exports = {
  'delegate': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.elementPresent('#test')
      .click('#test a')
      .assert.containsText('#test2', '1')
      .end();
  }
};