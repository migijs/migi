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
      .assert.containsText('#test p', '3')
      .assert.containsText('#test2', '<b migi-uid="4">3</b>');
  },
  'click2': function(browser) {
    browser
      .click('#test span')
      .assert.containsText('#test p', '4')
      .assert.containsText('#test2', '4');
  },
  'click3': function(browser) {
    browser
      .click('#test span')
      .assert.containsText('#test p', '5')
      .assert.containsText('#test2', '<b migi-uid="5">5</b>');
  },
  'click4': function(browser) {
    browser
      .click('#test span')
      .assert.containsText('#test p', '6')
      .assert.containsText('#test2', '<b migi-uid="5">6</b>');
  },
  'click5': function(browser) {
    browser
      .click('#test span')
      .assert.containsText('#test p', '7')
      .assert.containsText('#test2', '7')
      .end();
  },
};