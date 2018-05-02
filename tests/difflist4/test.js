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
  'a': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '1')
      .assert.containsText('#test p[ref="2"]', '1')
  },
  'b': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '1')
      .assert.containsText('#test p[ref="2"]', '')
  },
  'c': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '1')
      .assert.containsText('#test p[ref="2"]', '12')
  },
  'd': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '1')
      .assert.containsText('#test p[ref="2"]', '')
  },
  'e': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '12<span migi-uid="6">3</span>')
  },
  'f': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '1')
      .assert.containsText('#test p[ref="2"]', '')
  },
  'g': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '3')
      .assert.containsText('#test p[ref="2"]', '12<span migi-uid="7">3</span><span migi-uid="8">4</span>')
  },
  'h': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '1')
      .assert.containsText('#test p[ref="2"]', '')
  },
  'i': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '4')
      .assert.containsText('#test p[ref="2"]', '12<span migi-uid="9">3</span><span migi-uid="10">4</span>5')
  },
  'j': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '1')
      .assert.containsText('#test p[ref="2"]', '')
  },
  'k': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '4')
      .assert.containsText('#test p[ref="2"]', '12<span migi-uid="11">3</span><span migi-uid="12">4</span>56')
  },
  'l': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '1')
      .assert.containsText('#test p[ref="2"]', '')
  },
  'm': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '5')
      .assert.containsText('#test p[ref="2"]', '12<span migi-uid="13">3</span><span migi-uid="14">4</span>56<span migi-uid="15">7</span>')
  },
  'n': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '1')
      .assert.containsText('#test p[ref="2"]', '')
  },
  'o': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2')
      .assert.containsText('#test p[ref="2"]', '1<span migi-uid="16">2</span>')
  },
  'p': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '1')
      .assert.containsText('#test p[ref="2"]', '')
  },
  'q': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '3')
      .assert.containsText('#test p[ref="2"]', '1<span migi-uid="17">2</span><span migi-uid="18">3</span>')
  },
  'r': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '1')
      .assert.containsText('#test p[ref="2"]', '')
  },
  's': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '4')
      .assert.containsText('#test p[ref="2"]', '1<span migi-uid="19">2</span><span migi-uid="20">3</span>4')
  },
  't': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '1')
      .assert.containsText('#test p[ref="2"]', '')
  },
  'u': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '4')
      .assert.containsText('#test p[ref="2"]', '1<span migi-uid="21">2</span><span migi-uid="22">3</span>45')
  },
  'v': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '1')
      .assert.containsText('#test p[ref="2"]', '')
  },
  'w': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '5')
      .assert.containsText('#test p[ref="2"]', '1<span migi-uid="23">2</span><span migi-uid="24">3</span>45<span migi-uid="25">6</span>')
      .end()
  },
};