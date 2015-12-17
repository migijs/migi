var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.cssProperty('#test span', 'padding', '0px')
      .assert.cssProperty('#test a', 'margin', '0px')
      .moveToElement('#test a', 1, 1)
      .assert.cssProperty('#test a', 'margin', '1px')
      .assert.containsText('#test2', '0')
      .end()
  }
};