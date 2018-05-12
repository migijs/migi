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
  't2td': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '3')
      .assert.containsText('#test p[ref="2"]', '1<span migi-uid="7">2</span><span migi-uid="1">0</span>')
  },
  't2td_restore': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '1<span migi-uid="1">0</span>')
  },
  't2tt': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '12<span migi-uid="1">0</span>')
  },
  't2tt_restore': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '1<span migi-uid="1">0</span>')
  },
  't2tdt': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '4')
      .assert.containsText('#test p[ref="2"]', '1<span migi-uid="12">2</span>3<span migi-uid="1">0</span>')
  },
  't2tdt_restore': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '1<span migi-uid="1">0</span>')
  },
  't2tdtd': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '5')
      .assert.containsText('#test p[ref="2"]', '1<span migi-uid="15">2</span>3<span migi-uid="16">4</span><span migi-uid="1">0</span>')
  },
  't2tdtd_restore': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '1<span migi-uid="1">0</span>')
  },
  't2tdtdt': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '6')
      .assert.containsText('#test p[ref="2"]', '1<span migi-uid="19">2</span>3<span migi-uid="20">4</span>5<span migi-uid="1">0</span>')
  },
  't2tdtdt_restore': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '1<span migi-uid="1">0</span>')
  },
  't2ttd': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '3')
      .assert.containsText('#test p[ref="2"]', '12<span migi-uid="23">3</span><span migi-uid="1">0</span>')
  },
  't2ttd_restore': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '1<span migi-uid="1">0</span>')
  },
  't2ttdd': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '4')
      .assert.containsText('#test p[ref="2"]', '12<span migi-uid="26">3</span><span migi-uid="27">4</span><span migi-uid="1">0</span>')
  },
  't2ttdd_restore': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '1<span migi-uid="1">0</span>')
  },
  't2ttdt': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '4')
      .assert.containsText('#test p[ref="2"]', '12<span migi-uid="30">3</span>4<span migi-uid="1">0</span>')
  },
  't2ttdt_restore': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '1<span migi-uid="1">0</span>')
  },
  't2ttdtd': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '5')
      .assert.containsText('#test p[ref="2"]', '12<span migi-uid="33">3</span>4<span migi-uid="34">5</span><span migi-uid="1">0</span>')
  },
  't2ttdtd_restore': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '1<span migi-uid="1">0</span>')
      .end()
  },
};