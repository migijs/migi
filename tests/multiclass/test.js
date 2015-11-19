var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.elementPresent('#test div')
      .assert.cssProperty('#test div', 'margin', '1px')
      .assert.cssProperty('#test div', 'padding', '2px')
      .assert.cssProperty('#test div', 'width', '100px')
      .assert.cssProperty('#test div', 'height', '200px')
      .end();
  }
};