var path = require('path');
var fs = require('fs');

module.exports = {
  'shadow': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.elementPresent('#test p')
      .assert.containsText('#test p', '1')
      .click('#test p')
      .assert.containsText('#test p', '11')
      .end();
  }
};