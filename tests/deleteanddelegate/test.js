var path = require('path');
var fs = require('fs');

module.exports = {
  'delegate': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.elementPresent('#test b')
      .click('#test b')
      .assert.containsText('#test2', 'no')
      .end();
  }
};