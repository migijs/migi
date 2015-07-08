var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.containsText('#test [ref]', '<span migi-uid="1">1</span>')
  },
  'click add': function(browser) {
    browser
      .click('#test p')
      .assert.containsText('#test [ref]', '<span migi-uid="1">1<span migi-uid="7">2<span migi-uid="6">3</span></span></span>')
  },
  'click del': function(browser) {
    browser
      .click('#test p')
      .assert.containsText('#test [ref]', '<span migi-uid="1">1</span>')
      .end()
  }
};