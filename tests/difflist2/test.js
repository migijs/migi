var path = require('path');
var fs = require('fs');

module.exports = {
  'init empty': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.containsText('#test p[ref="1"]', '1')
      .assert.containsText('#test p[ref="2"]', '')
  },
  '2ttt': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '1')
      .assert.containsText('#test p[ref="2"]', '789')
  },
  'ttt2dtt': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="6">1</span>23')
  },
  'dtt2ttt': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '1')
      .assert.containsText('#test p[ref="2"]', '789')
  },
  'ttt2tdt': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '3')
      .assert.containsText('#test p[ref="2"]', '1<span migi-uid="7">2</span>3')
  },
  'tdt2ttt': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '1')
      .assert.containsText('#test p[ref="2"]', '789')
  },
  'ttt2ttd': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '12<span migi-uid="8">3</span>')
  },
  'ttd2ttt': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '1')
      .assert.containsText('#test p[ref="2"]', '789')
  },
  'ttt2ddt': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '3')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="9">1</span><span migi-uid="10">2</span>3')
  },
  'ddt2ttt': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '1')
      .assert.containsText('#test p[ref="2"]', '789')
  },
  'ttt2tdd': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '3')
      .assert.containsText('#test p[ref="2"]', '1<span migi-uid="11">2</span><span migi-uid="12">3</span>')
  },
  'tdd2ttt': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '1')
      .assert.containsText('#test p[ref="2"]', '789')
  },
  'ttt2dtd': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '3')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="13">1</span>2<span migi-uid="14">3</span>')
  },
  'dtd2ttt': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '1')
      .assert.containsText('#test p[ref="2"]', '789')
  },
  'ttt2ddd': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '3')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="15">4</span><span migi-uid="16">5</span><span migi-uid="17">6</span>')
  },
  'ddd2tdd': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '3')
      .assert.containsText('#test p[ref="2"]', '1<span migi-uid="16">2</span><span migi-uid="17">3</span>')
  },
  'tdd2ddd': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '3')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="20">4</span><span migi-uid="16">5</span><span migi-uid="17">6</span>')
  },
  'ddd2dtd': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '3')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="20">1</span>2<span migi-uid="17">3</span>')
  },
  'dtd2ddd': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '3')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="20">4</span><span migi-uid="26">5</span><span migi-uid="17">6</span>')
  },
  'ddd2ddt': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '3')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="20">1</span><span migi-uid="26">2</span>3')
  },
  'ddt2ddd': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '3')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="20">4</span><span migi-uid="26">5</span><span migi-uid="32">6</span>')
  },
  'ddd2ttd': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '12<span migi-uid="32">3</span>')
  },
  'ttd2ddd': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '3')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="34">4</span><span migi-uid="35">5</span><span migi-uid="32">6</span>')
  },
  'ddd2dtt': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="34">1</span>23')
  },
  'dtt2ddd': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '3')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="34">4</span><span migi-uid="39">5</span><span migi-uid="40">6</span>')
  },
  'ddd2tdt': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '3')
      .assert.containsText('#test p[ref="2"]', '1<span migi-uid="39">2</span>3')
  },
  'tdt2ddd': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '3')
      .assert.containsText('#test p[ref="2"]', '<span migi-uid="42">4</span><span migi-uid="39">5</span><span migi-uid="44">6</span>')
      .end()
  }
};