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
  'd2td': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '3')
      .assert.containsText('#test p[ref="2"]', '1<span migi-uid="8">2</span><span migi-uid="2">0</span>')
  },
  'd2td_restore': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="10">1</span><span migi-uid="2">0</span>')
  },
  'd2tt': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '12<span migi-uid="2">0</span>')
  },
  'd2tt_restore': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="13">1</span><span migi-uid="14">0</span>')
  },
  'd2tdt': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '4')
      .assert.containsText('#test p[ref="2"]', '1<span migi-uid="14">2</span>3<span migi-uid="16">0</span>')
  },
  'd2tdt_restore': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="17">1</span><span migi-uid="16">0</span>')
  },
  'd2tdtd': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '5')
      .assert.containsText('#test p[ref="2"]', '1<span migi-uid="19">2</span>3<span migi-uid="20">4</span><span migi-uid="16">0</span>')
  },
  'd2tdtd_restore': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="22">1</span><span migi-uid="16">0</span>')
  },
  'd2tdtdt': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '6')
      .assert.containsText('#test p[ref="2"]', '1<span migi-uid="24">2</span>3<span migi-uid="25">4</span>5<span migi-uid="16">0</span>')
  },
  'd2tdtdt_restore': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="27">1</span><span migi-uid="16">0</span>')
  },
  'd2ttd': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '3')
      .assert.containsText('#test p[ref="2"]', '12<span migi-uid="29">3</span><span migi-uid="16">0</span>')
  },
  'd2ttd_restore': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="31">1</span><span migi-uid="16">0</span>')
  },
  'd2ttdd': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '4')
      .assert.containsText('#test p[ref="2"]', '12<span migi-uid="33">3</span><span migi-uid="34">4</span><span migi-uid="16">0</span>')
  },
  'd2ttdd_restore': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="36">1</span><span migi-uid="16">0</span>')
  },
  'd2ttdt': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '4')
      .assert.containsText('#test p[ref="2"]', '12<span migi-uid="38">3</span>4<span migi-uid="16">0</span>')
  },
  'd2ttdt_restore': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="40">1</span><span migi-uid="16">0</span>')
  },
  'd2ttdtd': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '5')
      .assert.containsText('#test p[ref="2"]', '12<span migi-uid="42">3</span>4<span migi-uid="43">5</span><span migi-uid="16">0</span>')
  },
  'd2ttdtd_restore': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="45">1</span><span migi-uid="16">0</span>')
      .end()
  },
};