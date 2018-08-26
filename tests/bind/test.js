var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.elementPresent('#test p')
      .assert.containsText('#test p', '12');
  },
  'click': function(browser) {
    browser
      .click('#test span')
      .assert.containsText('#test p', '13');
  },
  'click2': function(browser) {
    browser
      .click('#test span')
      .assert.containsText('#test p', '14');
  },
  'click3': function(browser) {
    browser
      .click('#test span')
      .assert.containsText('#test p', '145');
  },
  'click4': function(browser) {
    browser
      .click('#test span')
      .assert.containsText('#test p', '14')
      .end();
  },
};