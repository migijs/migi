var path = require('path');
var fs = require('fs');

module.exports = {
  'init empty': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '12<span migi-uid="4">d</span>')
  },
  'popT1': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '1<span migi-uid="4">d</span>')
  },
  'popT2': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="4">d</span>')
  },
  'restore3T': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '012<span migi-uid="4">d</span>')
  },
  'popT3': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '01<span migi-uid="4">d</span>')
  },
  'popT4': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '0<span migi-uid="4">d</span>')
  },
  'restoreDTT': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '3')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="7">0</span>12<span migi-uid="4">d</span>')
  },
  'popT5': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '3')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="7">0</span>1<span migi-uid="4">d</span>')
  },
  'popT6': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="7">0</span><span migi-uid="4">d</span>')
  },
  'restoreDD': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '3')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="7">1</span><span migi-uid="9">2</span><span migi-uid="4">d</span>')
  },
  'popD1': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="7">1</span><span migi-uid="4">d</span>')
  },
  'popD2': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="4">d</span>')
  },
  'restoreTDD': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '4')
      .assert.containsText('#test p[ref="2"]', '0<span migi-uid="10">1</span><span migi-uid="11">2</span><span migi-uid="4">d</span>')
  },
  'popD3': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '3')
      .assert.containsText('#test p[ref="2"]', '0<span migi-uid="10">1</span><span migi-uid="4">d</span>')
  },
  'popD4': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '0<span migi-uid="4">d</span>')
  },
  'restoreDDD': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '4')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="12">0</span><span migi-uid="13">1</span><span migi-uid="14">2</span><span migi-uid="4">d</span>')
  },
  'popD5': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '3')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="12">0</span><span migi-uid="13">1</span><span migi-uid="4">d</span>')
  },
  'popD6': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="12">0</span><span migi-uid="4">d</span>')
  },
  'end': function(browser) {
    browser
      .end()
  }
};