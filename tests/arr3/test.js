var path = require('path');
var fs = require('fs');

module.exports = {
  'unidirectional': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.elementPresent('#test span')
      .assert.containsText('#test span', '1')
      .click('#test p.p1')
      .assert.containsText('#test span', '12')
      .click('#test p.p2')
      .assert.containsText('#test span', '123')
      .end();
  }
};