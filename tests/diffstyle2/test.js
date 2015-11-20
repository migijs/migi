var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.cssProperty('#test li', 'padding', '1px')
      .moveToElement('#test li', 1, 1)
      .assert.cssProperty('#test li', 'padding', '2px')
      .end()
  }
};