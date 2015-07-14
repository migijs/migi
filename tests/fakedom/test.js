var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.elementPresent('#fake1')
      .assert.elementPresent('#fake2')
      .assert.containsText('#fake1', 'undefined')
      .assert.containsText('#fake2', 'true')
      .end();
  }
};