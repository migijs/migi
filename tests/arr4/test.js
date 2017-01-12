var path = require('path');
var fs = require('fs');

module.exports = {
  'arr4': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.elementPresent('#test p')
      .assert.containsText('#test p', '1')
      .click('#test p')
      .assert.containsText('#test p', '12')
      .end();
  }
};