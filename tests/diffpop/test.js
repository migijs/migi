var path = require('path');
var fs = require('fs');

module.exports = {
  'init empty': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.containsText('#test p[ref="1"]', '1')
      .assert.containsText('#test p[ref="2"]', '12')
  },
  'popT1': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '1')
      .assert.containsText('#test p[ref="2"]', '1')
  },
  'popT2': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '1')
      .assert.containsText('#test p[ref="2"]', '')
  },
  'restore3T': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '1')
      .assert.containsText('#test p[ref="2"]', '012')
  },
  'popT3': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '1')
      .assert.containsText('#test p[ref="2"]', '01')
  },
  'popT4': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '1')
      .assert.containsText('#test p[ref="2"]', '0')
  },
  'restoreDTT': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="6">0</span>12')
  },
  'popT5': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="6">0</span>1')
  },
  'popT6': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '1')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="6">0</span>')
  },
  'restoreDD': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="6">1</span><span migi-uid="8">2</span>')
  },
  'popD1': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '1')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="6">1</span>')
  },
  'popD2': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '1')
      .assert.containsText('#test p[ref="2"]', '')
  },
  'restoreTDD': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '3')
      .assert.containsText('#test p[ref="2"]', '0<span migi-uid="9">1</span><span migi-uid="10">2</span>')
  },
  'popD3': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '0<span migi-uid="9">1</span>')
  },
  'popD4': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '1')
      .assert.containsText('#test p[ref="2"]', '0')
  },
  'restoreDDD': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '3')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="11">0</span><span migi-uid="12">1</span><span migi-uid="13">2</span>')
  },
  'popD5': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="11">0</span><span migi-uid="12">1</span>')
  },
  'popD6': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '1')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="11">0</span>')
  },
  'end': function(browser) {
    browser
      .end()
  }
};