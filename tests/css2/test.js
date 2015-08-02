var path = require('path');
var fs = require('fs');

module.exports = {
  'simple': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.elementPresent('#test div')
      .assert.cssProperty('#test div', 'margin', '0px')
  },
  'hover': function(browser) {
    browser
      .moveToElement('#test div', 1, 1)
      .assert.cssProperty('#test div', 'margin', '1px')
      .end();
  }
};