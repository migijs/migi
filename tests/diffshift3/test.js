var path = require('path');
var fs = require('fs');

module.exports = {
  'init empty': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.containsText('#test p[ref="1"]', '3')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="4">d</span>12<span migi-uid="5">d</span>')
  },
  'shift1': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '3')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="4">d</span>2<span migi-uid="5">d</span>')
  },
  'shift2': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '3')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="4">d</span><span migi-uid="5">d</span>')
  },
  'restore1': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '3')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="4">d</span>012<span migi-uid="5">d</span>')
  },
  'shift3': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '3')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="4">d</span>12<span migi-uid="5">d</span>')
  },
  'shift4': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '3')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="4">d</span>2<span migi-uid="5">d</span>')
  },
  'restore2': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '4')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="4">d</span><span migi-uid="8">0</span>12<span migi-uid="5">d</span>')
  },
  'shift5': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '3')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="4">d</span>12<span migi-uid="5">d</span>')
  },
  'shift6': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '3')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="4">d</span>2<span migi-uid="5">d</span>')
  },
  'restore3': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '4')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="4">d</span><span migi-uid="9">1</span><span migi-uid="10">2</span><span migi-uid="5">d</span>')
  },
  'shift7': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '3')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="4">d</span><span migi-uid="10">2</span><span migi-uid="5">d</span>')
  },
  'shift8': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '3')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="4">d</span><span migi-uid="5">d</span>')
  },
  'restore4': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '5')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="4">d</span>0<span migi-uid="11">1</span><span migi-uid="12">2</span><span migi-uid="5">d</span>')
  },
  'shift9': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '4')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="4">d</span><span migi-uid="11">1</span><span migi-uid="12">2</span><span migi-uid="5">d</span>')
  },
  'shift10': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '3')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="4">d</span><span migi-uid="12">2</span><span migi-uid="5">d</span>')
  },
  'restore5': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '5')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="4">d</span><span migi-uid="12">0</span><span migi-uid="14">1</span><span migi-uid="15">2</span><span migi-uid="5">d</span>')
  },
  'shift11': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '4')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="4">d</span><span migi-uid="14">1</span><span migi-uid="15">2</span><span migi-uid="5">d</span>')
  },
  'shift12': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '3')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="4">d</span><span migi-uid="15">2</span><span migi-uid="5">d</span>')
  },
  'end': function(browser) {
    browser
      .end()
  }
};