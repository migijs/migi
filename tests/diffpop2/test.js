var path = require('path');
var fs = require('fs');

module.exports = {
  'init empty': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.containsText('#test p[ref="1"]', '1')
      .assert.containsText('#test p[ref="2"]', '12t')
  },
  'popT1': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '1')
      .assert.containsText('#test p[ref="2"]', '1t')
  },
  'popT2': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '1')
      .assert.containsText('#test p[ref="2"]', 't')
  },
  'restore3T': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '1')
      .assert.containsText('#test p[ref="2"]', '012t')
  },
  'popT3': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '1')
      .assert.containsText('#test p[ref="2"]', '01t')
  },
  'popT4': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '1')
      .assert.containsText('#test p[ref="2"]', '0t')
  },
  'restoreDTT': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="6">0</span>12t')
  },
  'popT5': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="6">0</span>1t')
  },
  'popT6': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="6">0</span>t')
  },
  'restoreDD': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '3')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="6">1</span><span migi-uid="8">2</span>t')
  },
  'popD1': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="6">1</span>t')
  },
  'popD2': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '1')
      .assert.containsText('#test p[ref="2"]', 't')
  },
  'restoreTDD': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '4')
      .assert.containsText('#test p[ref="2"]', '0<span migi-uid="9">1</span><span migi-uid="10">2</span>t')
  },
  'popD3': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '3')
      .assert.containsText('#test p[ref="2"]', '0<span migi-uid="9">1</span>t')
  },
  'popD4': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '1')
      .assert.containsText('#test p[ref="2"]', '0t')
  },
  'restoreDDD': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '4')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="11">0</span><span migi-uid="12">1</span><span migi-uid="13">2</span>t')
  },
  'popD5': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '3')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="11">0</span><span migi-uid="12">1</span>t')
  },
  'popD6': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="11">0</span>t')
  },
  'end': function(browser) {
    browser
      .end()
  }
};