var path = require('path');
var fs = require('fs');

module.exports = {
  'unidirectional': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.elementPresent('#test p')
      .assert.containsText('#test p', 'You like this. Click to toggle.')
      .click('#test p')
      .assert.containsText('#test p', 'You unlike this. Click to toggle.')
      .click('#test p')
      .assert.containsText('#test p', 'You like this. Click to toggle.')
      .end();
  }
};