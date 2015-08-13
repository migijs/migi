var path = require('path');
var fs = require('fs');

module.exports = {
  'select': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.elementPresent('#test select')
      .assert.value('#test select', '1')
      .end();
  }
};