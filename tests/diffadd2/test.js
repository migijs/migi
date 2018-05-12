var path = require('path');
var fs = require('fs');

module.exports = {
  'init empty': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.containsText('#test p[ref="1"]', '1')
      .assert.containsText('#test p[ref="2"]', '10')
  },
  't2td': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '3')
      .assert.containsText('#test p[ref="2"]', '1<span migi-uid="6">2</span>0')
  },
  't2td_restore': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '1')
      .assert.containsText('#test p[ref="2"]', '10')
  },
  't2tt': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '1')
      .assert.containsText('#test p[ref="2"]', '120')
  },
  't2tt_restore': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '1')
      .assert.containsText('#test p[ref="2"]', '10')
  },
  't2tdt': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '3')
      .assert.containsText('#test p[ref="2"]', '1<span migi-uid="7">2</span>30')
  },
  't2tdt_restore': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '1')
      .assert.containsText('#test p[ref="2"]', '10')
  },
  't2tdtd': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '5')
      .assert.containsText('#test p[ref="2"]', '1<span migi-uid="8">2</span>3<span migi-uid="9">4</span>0')
  },
  't2tdtd_restore': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '1')
      .assert.containsText('#test p[ref="2"]', '10')
  },
  't2tdtdt': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '5')
      .assert.containsText('#test p[ref="2"]', '1<span migi-uid="10">2</span>3<span migi-uid="11">4</span>50')
  },
  't2tdtdt_restore': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '1')
      .assert.containsText('#test p[ref="2"]', '10')
  },
  't2ttd': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '3')
      .assert.containsText('#test p[ref="2"]', '12<span migi-uid="12">3</span>0')
  },
  't2ttd_restore': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '1')
      .assert.containsText('#test p[ref="2"]', '10')
  },
  't2ttdd': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '4')
      .assert.containsText('#test p[ref="2"]', '12<span migi-uid="13">3</span><span migi-uid="14">4</span>0')
  },
  't2ttdd_restore': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '1')
      .assert.containsText('#test p[ref="2"]', '10')
  },
  't2ttdt': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '3')
      .assert.containsText('#test p[ref="2"]', '12<span migi-uid="15">3</span>40')
  },
  't2ttdt_restore': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '1')
      .assert.containsText('#test p[ref="2"]', '10')
  },
  't2ttdtd': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '5')
      .assert.containsText('#test p[ref="2"]', '12<span migi-uid="16">3</span>4<span migi-uid="17">5</span>0')
      .end()
  },
};