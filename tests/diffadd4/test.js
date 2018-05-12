var path = require('path');
var fs = require('fs');

module.exports = {
  'init empty': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="1">1</span><span migi-uid="2">0</span>')
  },
  'd2dd': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '3')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="1">1</span><span migi-uid="9">2</span><span migi-uid="2">0</span>')
  },
  'd2dd_restore': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="1">1</span><span migi-uid="2">0</span>')
  },
  'd2dt': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '3')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="1">1</span>2<span migi-uid="2">0</span>')
  },
  'd2dt_restore': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="1">1</span><span migi-uid="2">0</span>')
  },
  'd2ddt': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '4')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="1">1</span><span migi-uid="18">2</span>3<span migi-uid="2">0</span>')
  },
  'd2ddt_restore': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="1">1</span><span migi-uid="2">0</span>')
  },
  'd2ddtd': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '5')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="1">1</span><span migi-uid="23">2</span>3<span migi-uid="24">4</span><span migi-uid="2">0</span>')
  },
  'd2ddtd_restore': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="1">1</span><span migi-uid="2">0</span>')
  },
  'd2ddtdt': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '6')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="1">1</span><span migi-uid="29">2</span>3<span migi-uid="30">4</span>5<span migi-uid="2">0</span>')
  },
  'd2ddtdt_restore': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="1">1</span><span migi-uid="2">0</span>')
  },
  'd2dtd': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '4')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="1">1</span>2<span migi-uid="35">3</span><span migi-uid="2">0</span>')
  },
  'd2dtd_restore': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="1">1</span><span migi-uid="2">0</span>')
  },
  'd2dtdd': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '5')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="1">1</span>2<span migi-uid="40">3</span><span migi-uid="41">4</span><span migi-uid="2">0</span>')
  },
  'd2dtdd_restore': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="1">1</span><span migi-uid="2">0</span>')
  },
  'd2dtdt': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '5')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="1">1</span>2<span migi-uid="46">3</span>4<span migi-uid="2">0</span>')
  },
  'd2dtdt_restore': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="1">1</span><span migi-uid="2">0</span>')
  },
  'd2dtdtd': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '6')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="1">1</span>2<span migi-uid="51">3</span>4<span migi-uid="52">5</span><span migi-uid="2">0</span>')
  },
  'd2dtdtd_restore': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="1">1</span><span migi-uid="2">0</span>')
      .end()
  },
};