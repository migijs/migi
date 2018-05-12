var path = require('path');
var fs = require('fs');

module.exports = {
  'init empty': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '1<span migi-uid="1">0</span>')
  },
  't2dd': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '3')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="7">1</span><span migi-uid="8">2</span><span migi-uid="1">0</span>')
  },
  't2dd_restore': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '1<span migi-uid="1">0</span>')
  },
  't2dt': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '3')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="11">1</span>2<span migi-uid="1">0</span>')
  },
  't2dt_restore': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '1<span migi-uid="1">0</span>')
  },
  't2ddt': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '4')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="14">1</span><span migi-uid="15">2</span>3<span migi-uid="1">0</span>')
  },
  't2ddt_restore': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '1<span migi-uid="1">0</span>')
  },
  't2ddtd': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '5')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="18">1</span><span migi-uid="19">2</span>3<span migi-uid="20">4</span><span migi-uid="1">0</span>')
  },
  't2ddtd_restore': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '1<span migi-uid="1">0</span>')
  },
  't2ddtdt': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '6')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="23">1</span><span migi-uid="24">2</span>3<span migi-uid="25">4</span>5<span migi-uid="1">0</span>')
  },
  't2ddtdt_restore': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '1<span migi-uid="1">0</span>')
  },
  't2dtd': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '4')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="28">1</span>2<span migi-uid="29">3</span><span migi-uid="1">0</span>')
  },
  't2dtd_restore': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '1<span migi-uid="1">0</span>')
  },
  't2dtdd': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '5')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="32">1</span>2<span migi-uid="33">3</span><span migi-uid="34">4</span><span migi-uid="1">0</span>')
  },
  't2dtdd_restore': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '1<span migi-uid="1">0</span>')
  },
  't2dtdt': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '5')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="37">1</span>2<span migi-uid="38">3</span>4<span migi-uid="1">0</span>')
  },
  't2dtdt_restore': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '1<span migi-uid="1">0</span>')
  },
  't2dtdtd': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '6')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="41">1</span>2<span migi-uid="42">3</span>4<span migi-uid="43">5</span><span migi-uid="1">0</span>')
  },
  't2dtdtd_restore': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '1<span migi-uid="1">0</span>')
      .end()
  },
};