var path = require('path');
var fs = require('fs');

module.exports = {
  'init empty': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.containsText('#test li[title="1个变量"]', '')
      .assert.containsText('#test li[title="2个变量"]', '')
      .assert.containsText('#test li[title="静态+变量"]', 'start')
      .assert.containsText('#test li[title="变量+静态"]', 'end')
      .assert.containsText('#test li[title="变量+静态+变量"]', 'middle')
      .assert.containsText('#test li[title="DOM+变量"]', 'dom')
      .assert.containsText('#test li[title="变量+DOM"]', 'dom')
      .assert.containsText('#test li[title="DOM+变量+DOM"]', 'domdom')
      .assert.containsText('#test li[title="DOM+变量+DOM+变量"]', 'domdom')
      .assert.containsText('#test li[title="变量+DOM+变量"]', 'dom')
      .assert.containsText('#test li[title="变量+DOM+变量+DOM"]', 'domdom')
      .assert.containsText('#test strong', '1,1,1,1,1,2,2,3,4,3,4,')
  },
  'add': function(browser) {
    browser
      .click('#test p[ref="add"]')
      .assert.containsText('#test li[title="1个变量"]', '01')
      .assert.containsText('#test li[title="2个变量"]', '0101')
      .assert.containsText('#test li[title="静态+变量"]', 'start 01')
      .assert.containsText('#test li[title="变量+静态"]', '01 end')
      .assert.containsText('#test li[title="变量+静态+变量"]', '01 middle 01')
      .assert.containsText('#test li[title="DOM+变量"]', 'dom01')
      .assert.containsText('#test li[title="变量+DOM"]', '01dom')
      .assert.containsText('#test li[title="DOM+变量+DOM"]', 'dom01dom')
      .assert.containsText('#test li[title="DOM+变量+DOM+变量"]', 'dom01dom01')
      .assert.containsText('#test li[title="变量+DOM+变量"]', '01dom01')
      .assert.containsText('#test li[title="变量+DOM+变量+DOM"]', '01dom01dom')
      .assert.containsText('#test strong', '2,4,3,3,5,3,3,4,6,5,6,')
  },
  'add again': function(browser) {
    browser
      .click('#test p[ref="add"]')
      .assert.containsText('#test li[title="1个变量"]', '0123')
      .assert.containsText('#test li[title="2个变量"]', '01230123')
      .assert.containsText('#test li[title="静态+变量"]', 'start 0123')
      .assert.containsText('#test li[title="变量+静态"]', '0123 end')
      .assert.containsText('#test li[title="变量+静态+变量"]', '0123 middle 0123')
      .assert.containsText('#test li[title="DOM+变量"]', 'dom0123')
      .assert.containsText('#test li[title="变量+DOM"]', '0123dom')
      .assert.containsText('#test li[title="DOM+变量+DOM"]', 'dom0123dom')
      .assert.containsText('#test li[title="DOM+变量+DOM+变量"]', 'dom0123dom0123')
      .assert.containsText('#test li[title="变量+DOM+变量"]', '0123dom0123')
      .assert.containsText('#test li[title="变量+DOM+变量+DOM"]', '0123dom0123dom')
      .assert.containsText('#test strong', '4,8,5,5,9,5,5,6,10,9,10,')
  },
  'del': function(browser) {
    browser
      .click('#test p[ref="del"]')
      .assert.containsText('#test li[title="1个变量"]', '01')
      .assert.containsText('#test li[title="2个变量"]', '0101')
      .assert.containsText('#test li[title="静态+变量"]', 'start 01')
      .assert.containsText('#test li[title="变量+静态"]', '01 end')
      .assert.containsText('#test li[title="变量+静态+变量"]', '01 middle 01')
      .assert.containsText('#test li[title="DOM+变量"]', 'dom01')
      .assert.containsText('#test li[title="变量+DOM"]', '01dom')
      .assert.containsText('#test li[title="DOM+变量+DOM"]', 'dom01dom')
      .assert.containsText('#test li[title="DOM+变量+DOM+变量"]', 'dom01dom01')
      .assert.containsText('#test li[title="变量+DOM+变量"]', '01dom01')
      .assert.containsText('#test li[title="变量+DOM+变量+DOM"]', '01dom01dom')
      .assert.containsText('#test strong', '2,4,3,3,5,3,3,4,6,5,6,')
  },
  'del again': function(browser) {
    browser
      .click('#test p[ref="del"]')
      .assert.containsText('#test li[title="1个变量"]', '')
      .assert.containsText('#test li[title="2个变量"]', '')
      .assert.containsText('#test li[title="静态+变量"]', 'start')
      .assert.containsText('#test li[title="变量+静态"]', 'end')
      .assert.containsText('#test li[title="变量+静态+变量"]', 'middle')
      .assert.containsText('#test li[title="DOM+变量"]', 'dom')
      .assert.containsText('#test li[title="变量+DOM"]', 'dom')
      .assert.containsText('#test li[title="DOM+变量+DOM"]', 'domdom')
      .assert.containsText('#test li[title="DOM+变量+DOM+变量"]', 'domdom')
      .assert.containsText('#test li[title="变量+DOM+变量"]', 'dom')
      .assert.containsText('#test li[title="变量+DOM+变量+DOM"]', 'domdom')
      .assert.containsText('#test strong', '1,1,1,1,1,2,2,3,4,3,4,')
  },
  'del empty': function(browser) {
    browser
      .click('#test p[ref="del"]')
      .assert.containsText('#test li[title="1个变量"]', '')
      .assert.containsText('#test li[title="2个变量"]', '')
      .assert.containsText('#test li[title="静态+变量"]', 'start')
      .assert.containsText('#test li[title="变量+静态"]', 'end')
      .assert.containsText('#test li[title="变量+静态+变量"]', 'middle')
      .assert.containsText('#test li[title="DOM+变量"]', 'dom')
      .assert.containsText('#test li[title="变量+DOM"]', 'dom')
      .assert.containsText('#test li[title="DOM+变量+DOM"]', 'domdom')
      .assert.containsText('#test li[title="DOM+变量+DOM+变量"]', 'domdom')
      .assert.containsText('#test li[title="变量+DOM+变量"]', 'dom')
      .assert.containsText('#test li[title="变量+DOM+变量+DOM"]', 'domdom')
      .assert.containsText('#test strong', '1,1,1,1,1,2,2,3,4,3,4,')
  },
  'add 2': function(browser) {
    browser
      .click('#test p[ref="add"]')
      .assert.containsText('#test li[title="1个变量"]', '45')
      .assert.containsText('#test li[title="2个变量"]', '4545')
      .assert.containsText('#test li[title="静态+变量"]', 'start 45')
      .assert.containsText('#test li[title="变量+静态"]', '45 end')
      .assert.containsText('#test li[title="变量+静态+变量"]', '45 middle 45')
      .assert.containsText('#test li[title="DOM+变量"]', 'dom45')
      .assert.containsText('#test li[title="变量+DOM"]', '45dom')
      .assert.containsText('#test li[title="DOM+变量+DOM"]', 'dom45dom')
      .assert.containsText('#test li[title="DOM+变量+DOM+变量"]', 'dom45dom45')
      .assert.containsText('#test li[title="变量+DOM+变量"]', '45dom45')
      .assert.containsText('#test li[title="变量+DOM+变量+DOM"]', '45dom45dom')
      .assert.containsText('#test strong', '2,4,3,3,5,3,3,4,6,5,6,')
  },
  'del 2': function(browser) {
    browser
      .click('#test p[ref="del"]')
      .assert.containsText('#test li[title="1个变量"]', '')
      .assert.containsText('#test li[title="2个变量"]', '')
      .assert.containsText('#test li[title="静态+变量"]', 'start')
      .assert.containsText('#test li[title="变量+静态"]', 'end')
      .assert.containsText('#test li[title="变量+静态+变量"]', 'middle')
      .assert.containsText('#test li[title="DOM+变量"]', 'dom')
      .assert.containsText('#test li[title="变量+DOM"]', 'dom')
      .assert.containsText('#test li[title="DOM+变量+DOM"]', 'domdom')
      .assert.containsText('#test li[title="DOM+变量+DOM+变量"]', 'domdom')
      .assert.containsText('#test li[title="变量+DOM+变量"]', 'dom')
      .assert.containsText('#test li[title="变量+DOM+变量+DOM"]', 'domdom')
      .assert.containsText('#test strong', '1,1,1,1,1,2,2,3,4,3,4,')
      .end()
  }
};