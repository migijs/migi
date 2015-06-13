var path = require('path');
var fs = require('fs');

module.exports = {
  'shadow': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.elementPresent('#test p span')
      .click('#test p span')
      .assert.attributeEquals('body', 'inner', '1')
      .assert.attributeEquals('body', 'p', '1')
      .end();
  }
};