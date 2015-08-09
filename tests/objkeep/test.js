var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.containsText('#test [ref="1"]', '51')
      .assert.containsText('#test [ref="2"]', '15')
  },
  'click': function(browser) {
    browser
      .click('#test p[ref="c1"]')
      .assert.containsText('#test [ref="1"]', '512')
      .assert.containsText('#test [ref="2"]', '125')
      .click('#test p[ref="c2"]')
      .assert.containsText('#test [ref="1"]', '12')
      .assert.containsText('#test [ref="2"]', '12')
      .end();
  }
};