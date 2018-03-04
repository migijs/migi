var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.elementPresent('#test a')
      .assert.elementPresent('#test2')
      .click('#test a')
      .pause(1000)
      .assert.containsText('#test2', 'true,true,true')
      .end();
  }
};