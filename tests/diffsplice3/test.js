var path = require('path');
var fs = require('fs');

module.exports = {
  'init empty': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.containsText('#test p[ref="1"]', '3')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="4">a</span>123<span migi-uid="5">b</span>')
  },
  'splice1': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '3')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="4">a</span>423<span migi-uid="5">b</span>')
  },
  'splice2': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '3')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="4">a</span>5423<span migi-uid="5">b</span>')
  },
  'splice3': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '3')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="4">a</span>623<span migi-uid="5">b</span>')
  },
  'splice4': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '3')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="4">a</span>23<span migi-uid="5">b</span>')
  },
  'splice5': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '3')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="4">a</span>273<span migi-uid="5">b</span>')
  },
  'splice6': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '3')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="4">a</span>283<span migi-uid="5">b</span>')
  },
  'splice7': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '3')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="4">a</span>28<span migi-uid="5">b</span>')
  },
  'restore': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '3')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="4">a</span>123<span migi-uid="5">b</span>')
  },
  'splice8': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '4')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="4">a</span><span migi-uid="8">4</span>23<span migi-uid="5">b</span>')
  },
  'splice9': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '5')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="4">a</span><span migi-uid="9">5</span><span migi-uid="8">4</span>23<span migi-uid="5">b</span>')
  },
  'splice10': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '4')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="4">a</span><span migi-uid="9">6</span>23<span migi-uid="5">b</span>')
  },
  'splice11': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '3')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="4">a</span>23<span migi-uid="5">b</span>')
  },
  'splice12': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '5')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="4">a</span>2<span migi-uid="11">7</span>3<span migi-uid="5">b</span>')
  },
  'splice13': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '5')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="4">a</span>2<span migi-uid="11">8</span>3<span migi-uid="5">b</span>')
  },
  'splice14': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '4')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="4">a</span>2<span migi-uid="11">8</span><span migi-uid="5">b</span>')
  },
  'end': function(browser) {
    browser
      .end()
  }
};