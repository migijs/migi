var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.elementPresent('#test p')
  },
  'click add': function(browser) {
    browser
      .click('#test p')
      .assert.containsText('#test [ref]', '^12<span migi-uid="5">d</span>4$3')
  },
  'click del': function(browser) {
    browser
      .click('#test p')
      .assert.containsText('#test [ref]', '^$1')
  },
  'click add2': function(browser) {
    browser
      .click('#test p')
      .assert.containsText('#test [ref]', '^12<b migi-uid="5">3</b><b migi-uid="6">4</b>$3')
  },
  'click del2': function(browser) {
    browser
      .click('#test p')
      .assert.containsText('#test [ref]', '^$1')
  },
  'click add3': function(browser) {
    browser
      .click('#test p')
      .assert.containsText('#test [ref]', '^12<b migi-uid="6">3</b><b migi-uid="5">4</b>5$4')
  },
  'click del3': function(browser) {
    browser
      .click('#test p')
      .assert.containsText('#test [ref]', '^$1')
  },
  'click add4': function(browser) {
    browser
      .click('#test p')
      .assert.containsText('#test [ref]', '^12<b migi-uid="5">3</b><b migi-uid="6">4</b>5<b migi-uid="7">6</b>7<b migi-uid="8">8</b>$7')
  },
  'click del4': function(browser) {
    browser
      .click('#test p')
      .assert.containsText('#test [ref]', '^$1')
      .end()
  }
};