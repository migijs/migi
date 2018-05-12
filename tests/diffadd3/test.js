var path = require('path');
var fs = require('fs');

module.exports = {
  'init empty': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="1">1</span>0')
  },
  'd2dd': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '3')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="1">1</span><span migi-uid="8">2</span>0')
  },
  'd2dd_restore': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="1">1</span>0')
  },
  'd2dt': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="1">1</span>20')
  },
  'd2dt_restore': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="1">1</span>0')
  },
  'd2ddt': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '3')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="1">1</span><span migi-uid="13">2</span>30')
  },
  'd2ddt_restore': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="1">1</span>0')
  },
  'd2ddtd': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '5')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="1">1</span><span migi-uid="16">2</span>3<span migi-uid="17">4</span>0')
  },
  'd2ddtd_restore': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="1">1</span>0')
  },
  'd2ddtdt': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '5')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="1">1</span><span migi-uid="20">2</span>3<span migi-uid="21">4</span>50')
  },
  'd2ddtdt_restore': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="1">1</span>0')
  },
  'd2dtd': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '4')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="1">1</span>2<span migi-uid="24">3</span>0')
  },
  'd2dtd_restore': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="1">1</span>0')
  },
  'd2dtdd': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '5')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="1">1</span>2<span migi-uid="27">3</span><span migi-uid="28">4</span>0')
  },
  'd2dtdd_restore': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="1">1</span>0')
  },
  'd2dtdt': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '4')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="1">1</span>2<span migi-uid="31">3</span>40')
  },
  'd2dtdt_restore': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="1">1</span>0')
  },
  'd2dtdtd': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '6')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="1">1</span>2<span migi-uid="34">3</span>4<span migi-uid="35">5</span>0')
  },
  'd2dtdtd_restore': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="1">1</span>0')
      .end()
  },
};