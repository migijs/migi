var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.elementPresent('#test p')
      .assert.containsText('#test p', '2');
  },
  'click': function(browser) {
    browser
      .click('#test span')
      .assert.containsText('#test p', '3');
  },
  'click2': function(browser) {
    browser
      .click('#test span')
      .assert.containsText('#test p', '4');
  },
  'click3': function(browser) {
    browser
      .click('#test span')
      .assert.containsText('#test p', '45');
  },
  'click4': function(browser) {
    browser
      .click('#test span')
      .assert.containsText('#test p', '4')
      .end();
  },
};