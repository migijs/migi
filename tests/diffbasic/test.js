var path = require('path');
var fs = require('fs');

module.exports = {
  'init empty': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.containsText('#test p[ref="1"]', '112')
      .assert.containsText('#test p[ref="2"]', '112')
      .assert.containsText('#test p[ref="3"]', '112')
      .assert.containsText('#test p[ref="4"]', '112')
  },
  'tt2': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '134')
      .assert.containsText('#test p[ref="2"]', '23<span migi-uid="12">4</span>')
      .assert.containsText('#test p[ref="3"]', '2<span migi-uid="13">3</span>4')
      .assert.containsText('#test p[ref="4"]', '2<span migi-uid="14">3</span><span migi-uid="15">4</span>')
  },
  'tt2restore': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '21<span migi-uid="16">2</span>')
      .assert.containsText('#test p[ref="2"]', '21<span migi-uid="12">2</span>')
      .assert.containsText('#test p[ref="3"]', '21<span migi-uid="18">2</span>')
      .assert.containsText('#test p[ref="4"]', '21<span migi-uid="15">2</span>')
  },
  'td2': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '134')
      .assert.containsText('#test p[ref="2"]', '23<span migi-uid="12">4</span>')
      .assert.containsText('#test p[ref="3"]', '2<span migi-uid="21">3</span>4')
      .assert.containsText('#test p[ref="4"]', '2<span migi-uid="22">3</span><span migi-uid="15">4</span>')
  },
  'td2restore': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2<span migi-uid="24">1</span>2')
      .assert.containsText('#test p[ref="2"]', '2<span migi-uid="25">1</span>2')
      .assert.containsText('#test p[ref="3"]', '2<span migi-uid="21">1</span>2')
      .assert.containsText('#test p[ref="4"]', '2<span migi-uid="22">1</span>2')
  },
  'dt2': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '134')
      .assert.containsText('#test p[ref="2"]', '23<span migi-uid="28">4</span>')
      .assert.containsText('#test p[ref="3"]', '2<span migi-uid="21">3</span>4')
      .assert.containsText('#test p[ref="4"]', '2<span migi-uid="22">3</span><span migi-uid="31">4</span>')
  },
  'dt2restore': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '2<span migi-uid="32">1</span><span migi-uid="33">2</span>')
      .assert.containsText('#test p[ref="2"]', '2<span migi-uid="34">1</span><span migi-uid="28">2</span>')
      .assert.containsText('#test p[ref="3"]', '2<span migi-uid="21">1</span><span migi-uid="37">2</span>')
      .assert.containsText('#test p[ref="4"]', '2<span migi-uid="22">1</span><span migi-uid="31">2</span>')
  },
  'dd2': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test p[ref="1"]', '134')
      .assert.containsText('#test p[ref="2"]', '23<span migi-uid="28">4</span>')
      .assert.containsText('#test p[ref="3"]', '2<span migi-uid="21">3</span>4')
      .assert.containsText('#test p[ref="4"]', '2<span migi-uid="22">3</span><span migi-uid="31">4</span>')
      .end()
  },
};