var path = require('path');
var fs = require('fs');

module.exports = {
  'delegate': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.elementPresent('#test strong')
      .click('#test span')
      .assert.containsText('#test strong', '')
      .end();
  }
};