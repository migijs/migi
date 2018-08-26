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
      .assert.containsText('#test p', '14,5');
  },
  'click4': function(browser) {
    browser
      .click('#test span')
      .assert.containsText('#test p', '14');
  },
  'click5': function(browser) {
    browser
      .click('#test span')
      .assert.containsText('#test p', '64');
  },
  'click6': function(browser) {
    browser
      .click('#test span')
      .assert.containsText('#test p', '6474');
  },
  'click7': function(browser) {
    browser
      .click('#test span')
      .assert.containsText('#test p', '64')
      .end();
  },
};