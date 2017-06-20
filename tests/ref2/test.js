var path = require('path');
var fs = require('fs');

module.exports = {
  'ref': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.elementPresent('#test p')
      .assert.elementPresent('#test span')
      .click('#test p')
      .assert.containsText('#test span', 'ref')
      .end();
  }
};