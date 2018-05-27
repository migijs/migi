var path = require('path');
var fs = require('fs');

module.exports = {
  'init empty': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="4">a</span>')
  },
  'pushT1': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '1<span migi-uid="4">a</span>')
  },
  'pushT2': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '12<span migi-uid="4">a</span>')
  },
  'restoreOneT': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '0<span migi-uid="4">a</span>')
  },
  'pushT3': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '04<span migi-uid="4">a</span>')
  },
  'pushT4': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '045<span migi-uid="4">a</span>')
  },
  'restoreOneD': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="7">0</span><span migi-uid="4">a</span>')
  },
  'pushT5': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '3')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="7">0</span>7<span migi-uid="4">a</span>')
  },
  'pushT6': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '3')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="7">0</span>78<span migi-uid="4">a</span>')
  },
  'restore': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="4">a</span>')
  },
  'pushD1': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="8">d</span><span migi-uid="4">a</span>')
  },
  'pushD2': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '3')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="8">d</span><span migi-uid="9">d</span><span migi-uid="4">a</span>')
  },
  'restoreOneT2': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '0<span migi-uid="4">a</span>')
  },
  'pushD3': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '3')
      .assert.containsText('#test p[ref="2"]', '0<span migi-uid="10">d</span><span migi-uid="4">a</span>')
  },
  'pushD4': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '4')
      .assert.containsText('#test p[ref="2"]', '0<span migi-uid="10">d</span><span migi-uid="11">d</span><span migi-uid="4">a</span>')
  },
  'restoreOneD2': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="12">0</span><span migi-uid="4">a</span>')
  },
  'pushD5': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '3')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="12">0</span><span migi-uid="13">d</span><span migi-uid="4">a</span>')
  },
  'pushD6': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '4')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="12">0</span><span migi-uid="13">d</span><span migi-uid="14">d</span><span migi-uid="4">a</span>')
  },
  'end': function(browser) {
    browser
      .end()
  }
};