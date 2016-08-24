var path = require('path');
var fs = require('fs');

module.exports = {
  'cachecomponent': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.elementPresent('#test p')
      .assert.containsText('#test p', '1')
      .assert.containsText('#test2', '1')
      .click('#test span')
      .pause(1000)
      .assert.containsText('#test p', '3')
      .assert.containsText('#test2', '2')
      .end();
  }
};