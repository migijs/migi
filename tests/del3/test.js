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
      .assert.containsText('#test [ref]', '^12$1')
  },
  't2d': function(browser) {
    browser
      .click('#test p')
      .assert.containsText('#test [ref]', '^1<span migi-uid="5">d</span>2$3')
  },
  'd2t': function(browser) {
    browser
      .click('#test p')
      .assert.containsText('#test [ref]', '^12$1')
  },
  't2t': function(browser) {
    browser
      .click('#test p')
      .assert.containsText('#test [ref]', '^112$1')
  },
  't2tt': function(browser) {
    browser
      .click('#test p')
      .assert.containsText('#test [ref]', '^1122$1')
  },
  'tt2t': function(browser) {
    browser
      .click('#test p')
      .assert.containsText('#test [ref]', '^12$1')
  },
  't2dt': function(browser) {
    browser
      .click('#test p')
      .assert.containsText('#test [ref]', '^1<span migi-uid="6">d</span>12$3')
  },
  'dt2t': function(browser) {
    browser
      .click('#test p')
      .assert.containsText('#test [ref]', '^12$1')
  },
  't2ttd': function(browser) {
    browser
      .click('#test p')
      .assert.containsText('#test [ref]', '^112<span migi-uid="7">d</span>2$3')
  },
  'ttd2t': function(browser) {
    browser
      .click('#test p')
      .assert.containsText('#test [ref]', '^12$1')
  },
  't2dd': function(browser) {
    browser
      .click('#test p')
      .assert.containsText('#test [ref]', '^1<span migi-uid="8">d</span><span migi-uid="9">d</span>2$4')
  },
  'dd2t': function(browser) {
    browser
      .click('#test p')
      .assert.containsText('#test [ref]', '^12$1')
  },
  't2ddt': function(browser) {
    browser
      .click('#test p')
      .assert.containsText('#test [ref]', '^1<span migi-uid="10">d</span><span migi-uid="11">d</span>12$4')
  },
  'ddt2t': function(browser) {
    browser
      .click('#test p')
      .assert.containsText('#test [ref]', '^12$1')
  },
  't2ddtd': function(browser) {
    browser
      .click('#test p')
      .assert.containsText('#test [ref]', '^1<span migi-uid="12">d</span><span migi-uid="13">d</span>1<span migi-uid="14">d</span>2$6')
  },
  'ddtd2t': function(browser) {
    browser
      .click('#test p')
      .assert.containsText('#test [ref]', '^12$1')
  },
  't2ttdt': function(browser) {
    browser
      .click('#test p')
      .assert.containsText('#test [ref]', '^112<span migi-uid="15">d</span>32$3')
  },
  'ttdt2t': function(browser) {
    browser
      .click('#test p')
      .assert.containsText('#test [ref]', '^12$1')
  },
  't2ttdtd': function(browser) {
    browser
      .click('#test p')
      .assert.containsText('#test [ref]', '^112<span migi-uid="16">d</span>3<span migi-uid="17">d</span>2$5')
      .end();
  }
};