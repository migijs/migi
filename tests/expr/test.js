var path = require('path');
var fs = require('fs');

module.exports = {
  'expr': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.elementPresent('#test p[ref="1"]')
      .assert.containsText('#test p[ref="1"]', 'a: 1, b: 2, max: 2')
      .assert.elementPresent('#test p[ref="2"]')
      .assert.containsText('#test p[ref="2"]', '12')
      .assert.elementPresent('#test p[ref="3"]')
      .assert.containsText('#test p[ref="3"]', '3')
      .assert.elementPresent('#test p[ref="4"]')
      .assert.containsText('#test p[ref="4"]', '2')
      .click('#test p[ref="a"]')
      .assert.containsText('#test p[ref="1"]', 'a: 2, b: 2, max: 2')
      .assert.containsText('#test p[ref="2"]', '22')
      .assert.containsText('#test p[ref="3"]', '4')
      .assert.containsText('#test p[ref="4"]', '4')
      .click('#test p[ref="b"]')
      .assert.containsText('#test p[ref="1"]', 'a: 2, b: 3, max: 3')
      .assert.containsText('#test p[ref="2"]', '23')
      .assert.containsText('#test p[ref="3"]', '5')
      .assert.containsText('#test p[ref="4"]', '6')
      .end();
  }
};