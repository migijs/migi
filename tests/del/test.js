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
      .assert.containsText('#test [ref]', '^<span migi-uid="5">d</span><span migi-uid="6">d</span>123')
  },
  'click del': function(browser) {
    browser
      .click('#test p')
      .assert.containsText('#test [ref]', '^1')
  },
  'click add2': function(browser) {
    browser
      .click('#test p')
      .assert.containsText('#test [ref]', '^<span migi-uid="7">d</span><span migi-uid="8">d</span>12<span migi-uid="9">d</span>4')
  },
  'click del2': function(browser) {
    browser
      .click('#test p')
      .assert.containsText('#test [ref]', '^1')
  },
  'click add3': function(browser) {
    browser
      .click('#test p')
      .assert.containsText('#test [ref]', '^<span migi-uid="10">d</span><span migi-uid="11">d</span>12<span migi-uid="12">d</span><span migi-uid="13">d</span>5')
  },
  'click del3': function(browser) {
    browser
      .click('#test p')
      .assert.containsText('#test [ref]', '^1')
  },
  'click add4': function(browser) {
    browser
      .click('#test p')
      .assert.containsText('#test [ref]', '^<span migi-uid="14">d</span><span migi-uid="15">d</span>12<span migi-uid="16">d</span>35')
  },
  'click del4': function(browser) {
    browser
      .click('#test p')
      .assert.containsText('#test [ref]', '^1')
  },
  'click add5': function(browser) {
    browser
      .click('#test p')
      .assert.containsText('#test [ref]', '^1<span migi-uid="17">d</span>23<span migi-uid="18">d</span>45')
  },
  'click del5': function(browser) {
    browser
      .click('#test p')
      .assert.containsText('#test [ref]', '^1<span migi-uid="17">d</span>2<span migi-uid="18">d</span>55')
      .end()
  }
};