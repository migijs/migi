var path = require('path');
var fs = require('fs');

module.exports = {
  'init': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.elementPresent('#test p')
  },
  'click init': function(browser) {
    browser
      .click('#test p')
      .assert.containsText('#test [ref]', '^<span migi-uid="5">d</span><span migi-uid="6">d</span>$3')
  },
  't2d': function(browser) {
    browser
      .click('#test p')
      .assert.containsText('#test [ref]', '^<span migi-uid="5">d</span><span migi-uid="8">d</span><span migi-uid="6">d</span>$3')
  },
  'd2t': function(browser) {
    browser
      .click('#test p')
      .assert.containsText('#test [ref]', '^<span migi-uid="5">d</span><span migi-uid="6">d</span>$3')
  },
  't2t': function(browser) {
    browser
      .click('#test p')
      .assert.containsText('#test [ref]', '^<span migi-uid="5">d</span>1<span migi-uid="6">d</span>$3')
  },
  't2tt': function(browser) {
    browser
      .click('#test p')
      .assert.containsText('#test [ref]', '^<span migi-uid="5">d</span>12<span migi-uid="6">d</span>$3')
  },
  'tt2t': function(browser) {
    browser
      .click('#test p')
      .assert.containsText('#test [ref]', '^<span migi-uid="5">d</span><span migi-uid="6">d</span>$3')
  },
  't2dt': function(browser) {
    browser
      .click('#test p')
      .assert.containsText('#test [ref]', '^<span migi-uid="5">d</span><span migi-uid="19">d</span>1<span migi-uid="6">d</span>$4')
  },
  'dt2t': function(browser) {
    browser
      .click('#test p')
      .assert.containsText('#test [ref]', '^<span migi-uid="5">d</span><span migi-uid="6">d</span>$3')
  },
  't2ttd': function(browser) {
    browser
      .click('#test p')
      .assert.containsText('#test [ref]', '^<span migi-uid="5">d</span>12<span migi-uid="24">d</span><span migi-uid="6">d</span>$4')
  },
  'ttd2t': function(browser) {
    browser
      .click('#test p')
      .assert.containsText('#test [ref]', '^<span migi-uid="5">d</span><span migi-uid="6">d</span>$3')
  },
  't2dd': function(browser) {
    browser
      .click('#test p')
      .assert.containsText('#test [ref]', '^<span migi-uid="5">d</span><span migi-uid="29">d</span><span migi-uid="30">d</span><span migi-uid="6">d</span>$4')
  },
  'dd2t': function(browser) {
    browser
      .click('#test p')
      .assert.containsText('#test [ref]', '^<span migi-uid="5">d</span><span migi-uid="6">d</span>$3')
  },
  't2ddt': function(browser) {
    browser
      .click('#test p')
      .assert.containsText('#test [ref]', '^<span migi-uid="5">d</span><span migi-uid="35">d</span><span migi-uid="36">d</span>1<span migi-uid="6">d</span>$5')
  },
  'ddt2t': function(browser) {
    browser
      .click('#test p')
      .assert.containsText('#test [ref]', '^<span migi-uid="5">d</span><span migi-uid="6">d</span>$3')
  },
  't2ddtd': function(browser) {
    browser
      .click('#test p')
      .assert.containsText('#test [ref]', '^<span migi-uid="5">d</span><span migi-uid="41">d</span><span migi-uid="42">d</span>1<span migi-uid="43">d</span><span migi-uid="6">d</span>$6')
  },
  'ddtd2t': function(browser) {
    browser
      .click('#test p')
      .assert.containsText('#test [ref]', '^<span migi-uid="5">d</span><span migi-uid="6">d</span>$3')
  },
  't2ttdt': function(browser) {
    browser
      .click('#test p')
      .assert.containsText('#test [ref]', '^<span migi-uid="5">d</span>12<span migi-uid="48">d</span>3<span migi-uid="6">d</span>$5')
  },
  'ttdt2t': function(browser) {
    browser
      .click('#test p')
      .assert.containsText('#test [ref]', '^<span migi-uid="5">d</span><span migi-uid="6">d</span>$3')
  },
  't2ttdtd': function(browser) {
    browser
      .click('#test p')
      .assert.containsText('#test [ref]', '^<span migi-uid="5">d</span>12<span migi-uid="53">d</span>3<span migi-uid="54">d</span><span migi-uid="6">d</span>$6')
      .end();
  }
};