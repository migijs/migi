var path = require('path');
var fs = require('fs');

module.exports = {
  'init empty': function(browser) {
    browser
      .url('file://' + path.join(__dirname, 'index.html'))
      .waitForElementVisible('body', 1000)
      .assert.containsText('#test li[title="1个变量"]', '')
      .assert.containsText('#test li[title="静态+变量"]', 'before')
      .assert.containsText('#test li[title="变量+静态"]', 'after')
      .assert.containsText('#test li[title="静态+变量+静态"]', 'beforeafter')
      .assert.containsText('#test li[title="变量+变量"]', '')
      .assert.containsText('#test li[title="变量+静态+变量"]', 'middle')
      .assert.containsText('#test li[title="静态+变量+静态+变量+静态"]', 'beforemiddleafter')
      .assert.containsText('#test li[title="变量+DOM"]', 'dom')
      .assert.containsText('#test li[title="DOM+变量"]', 'dom')
      .assert.containsText('#test li[title="DOM+变量+DOM"]', 'domdom')
      .assert.containsText('#test li[title="DOM+变量+DOM+变量"]', 'domdom')
      .assert.containsText('#test li[title="变量+DOM+变量+DOM"]', 'domdom')
      .assert.containsText('#test p[ref="1"]', '1,1,1,1,1,1,1,2,2,3,4,4,')
      .assert.containsText('#test p[ref="2"]', ',before,after,beforeafter,,middle,beforemiddleafter,<span migi-uid="11">dom</span>,<span migi-uid="13">dom</span>,<span migi-uid="15">dom</span><span migi-uid="16">dom</span>,<span migi-uid="18">dom</span><span migi-uid="19">dom</span>,<span migi-uid="21">dom</span><span migi-uid="22">dom</span>,')
  },
  'empty2text': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test li[title="1个变量"]', 'txt')
      .assert.containsText('#test li[title="静态+变量"]', 'beforetxt')
      .assert.containsText('#test li[title="变量+静态"]', 'txtafter')
      .assert.containsText('#test li[title="静态+变量+静态"]', 'beforetxtafter')
      .assert.containsText('#test li[title="变量+变量"]', 'txttxt')
      .assert.containsText('#test li[title="变量+静态+变量"]', 'txtmiddletxt')
      .assert.containsText('#test li[title="静态+变量+静态+变量+静态"]', 'beforetxtmiddletxtafter')
      .assert.containsText('#test li[title="变量+DOM"]', 'txtdom')
      .assert.containsText('#test li[title="DOM+变量"]', 'domtxt')
      .assert.containsText('#test li[title="DOM+变量+DOM"]', 'domtxtdom')
      .assert.containsText('#test li[title="DOM+变量+DOM+变量"]', 'domtxtdomtxt')
      .assert.containsText('#test li[title="变量+DOM+变量+DOM"]', 'txtdomtxtdom')
      .assert.containsText('#test p[ref="1"]', '1,1,1,1,1,1,1,2,2,3,4,4,')
      .assert.containsText('#test p[ref="2"]', 'txt,beforetxt,txtafter,beforetxtafter,txttxt,txtmiddletxt,beforetxtmiddletxtafter,txt<span migi-uid="11">dom</span>,<span migi-uid="13">dom</span>txt,<span migi-uid="15">dom</span>txt<span migi-uid="16">dom</span>,<span migi-uid="18">dom</span>txt<span migi-uid="19">dom</span>txt,txt<span migi-uid="21">dom</span>txt<span migi-uid="22">dom</span>,')
  },
  'text2dom': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test li[title="1个变量"]', 'dom')
      .assert.containsText('#test li[title="静态+变量"]', 'beforedom')
      .assert.containsText('#test li[title="变量+静态"]', 'domafter')
      .assert.containsText('#test li[title="静态+变量+静态"]', 'beforedomafter')
      .assert.containsText('#test li[title="变量+变量"]', 'dom')
      .assert.containsText('#test li[title="变量+静态+变量"]', 'dommiddledom')
      .assert.containsText('#test li[title="静态+变量+静态+变量+静态"]', 'beforedommiddledomafter')
      .assert.containsText('#test li[title="变量+DOM"]', 'domdom')
      .assert.containsText('#test li[title="DOM+变量"]', 'domdom')
      .assert.containsText('#test li[title="DOM+变量+DOM"]', 'domdomdom')
      .assert.containsText('#test li[title="DOM+变量+DOM+变量"]', 'domdomdomdom')
      .assert.containsText('#test li[title="变量+DOM+变量+DOM"]', 'domdomdomdom')
      .assert.containsText('#test p[ref="1"]', '1,2,2,3,2,3,5,2,2,3,4,4,')
      .assert.containsText('#test p[ref="2"]', '<b migi-uid="26">dom</b>,before<b migi-uid="26">dom</b>,<b migi-uid="26">dom</b>after,before<b migi-uid="26">dom</b>after,<b migi-uid="26">dom</b><b migi-uid="26">dom</b>,<b migi-uid="26">dom</b>middle<b migi-uid="26">dom</b>,before<b migi-uid="26">dom</b>middle<b migi-uid="26">dom</b>after,<b migi-uid="26">dom</b><span migi-uid="11">dom</span>,<span migi-uid="13">dom</span><b migi-uid="26">dom</b>,<span migi-uid="15">dom</span><b migi-uid="26">dom</b><span migi-uid="16">dom</span>,<span migi-uid="18">dom</span><b migi-uid="26">dom</b><span migi-uid="19">dom</span><b migi-uid="26">dom</b>,<b migi-uid="26">dom</b><span migi-uid="21">dom</span><b migi-uid="26">dom</b><span migi-uid="22">dom</span>,')
  },
  'dom2text': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test li[title="1个变量"]', 'txt')
      .assert.containsText('#test li[title="静态+变量"]', 'beforetxt')
      .assert.containsText('#test li[title="变量+静态"]', 'txtafter')
      .assert.containsText('#test li[title="静态+变量+静态"]', 'beforetxtafter')
      .assert.containsText('#test li[title="变量+变量"]', 'txttxt')
      .assert.containsText('#test li[title="变量+静态+变量"]', 'txtmiddletxt')
      .assert.containsText('#test li[title="静态+变量+静态+变量+静态"]', 'beforetxtmiddletxtafter')
      .assert.containsText('#test li[title="变量+DOM"]', 'txtdom')
      .assert.containsText('#test li[title="DOM+变量"]', 'domtxt')
      .assert.containsText('#test li[title="DOM+变量+DOM"]', 'domtxtdom')
      .assert.containsText('#test li[title="DOM+变量+DOM+变量"]', 'domtxtdomtxt')
      .assert.containsText('#test li[title="变量+DOM+变量+DOM"]', 'txtdomtxtdom')
      .assert.containsText('#test p[ref="1"]', '1,1,1,1,1,1,1,2,2,3,4,4,')
      .assert.containsText('#test p[ref="2"]', 'txt,beforetxt,txtafter,beforetxtafter,txttxt,txtmiddletxt,beforetxtmiddletxtafter,txt<span migi-uid="11">dom</span>,<span migi-uid="13">dom</span>txt,<span migi-uid="15">dom</span>txt<span migi-uid="16">dom</span>,<span migi-uid="18">dom</span>txt<span migi-uid="19">dom</span>txt,txt<span migi-uid="21">dom</span>txt<span migi-uid="22">dom</span>,')
  },
  'text2dom again': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test li[title="1个变量"]', 'dom')
      .assert.containsText('#test li[title="静态+变量"]', 'beforedom')
      .assert.containsText('#test li[title="变量+静态"]', 'domafter')
      .assert.containsText('#test li[title="静态+变量+静态"]', 'beforedomafter')
      .assert.containsText('#test li[title="变量+变量"]', 'dom')
      .assert.containsText('#test li[title="变量+静态+变量"]', 'dommiddledom')
      .assert.containsText('#test li[title="静态+变量+静态+变量+静态"]', 'beforedommiddledomafter')
      .assert.containsText('#test li[title="变量+DOM"]', 'domdom')
      .assert.containsText('#test li[title="DOM+变量"]', 'domdom')
      .assert.containsText('#test li[title="DOM+变量+DOM"]', 'domdomdom')
      .assert.containsText('#test li[title="DOM+变量+DOM+变量"]', 'domdomdomdom')
      .assert.containsText('#test li[title="变量+DOM+变量+DOM"]', 'domdomdomdom')
      .assert.containsText('#test p[ref="1"]', '1,2,2,3,2,3,5,2,2,3,4,4,')
      .assert.containsText('#test p[ref="2"]', '<b migi-uid="27">dom</b>,before<b migi-uid="27">dom</b>,<b migi-uid="27">dom</b>after,before<b migi-uid="27">dom</b>after,<b migi-uid="27">dom</b><b migi-uid="27">dom</b>,<b migi-uid="27">dom</b>middle<b migi-uid="27">dom</b>,before<b migi-uid="27">dom</b>middle<b migi-uid="27">dom</b>after,<b migi-uid="27">dom</b><span migi-uid="11">dom</span>,<span migi-uid="13">dom</span><b migi-uid="27">dom</b>,<span migi-uid="15">dom</span><b migi-uid="27">dom</b><span migi-uid="16">dom</span>,<span migi-uid="18">dom</span><b migi-uid="27">dom</b><span migi-uid="19">dom</span><b migi-uid="27">dom</b>,<b migi-uid="27">dom</b><span migi-uid="21">dom</span><b migi-uid="27">dom</b><span migi-uid="22">dom</span>,')
  },
  'dom2text again': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test li[title="1个变量"]', 'txt')
      .assert.containsText('#test li[title="静态+变量"]', 'beforetxt')
      .assert.containsText('#test li[title="变量+静态"]', 'txtafter')
      .assert.containsText('#test li[title="静态+变量+静态"]', 'beforetxtafter')
      .assert.containsText('#test li[title="变量+变量"]', 'txttxt')
      .assert.containsText('#test li[title="变量+静态+变量"]', 'txtmiddletxt')
      .assert.containsText('#test li[title="静态+变量+静态+变量+静态"]', 'beforetxtmiddletxtafter')
      .assert.containsText('#test li[title="变量+DOM"]', 'txtdom')
      .assert.containsText('#test li[title="DOM+变量"]', 'domtxt')
      .assert.containsText('#test li[title="DOM+变量+DOM"]', 'domtxtdom')
      .assert.containsText('#test li[title="DOM+变量+DOM+变量"]', 'domtxtdomtxt')
      .assert.containsText('#test li[title="变量+DOM+变量+DOM"]', 'txtdomtxtdom')
      .assert.containsText('#test p[ref="1"]', '1,1,1,1,1,1,1,2,2,3,4,4,')
      .assert.containsText('#test p[ref="2"]', 'txt,beforetxt,txtafter,beforetxtafter,txttxt,txtmiddletxt,beforetxtmiddletxtafter,txt<span migi-uid="11">dom</span>,<span migi-uid="13">dom</span>txt,<span migi-uid="15">dom</span>txt<span migi-uid="16">dom</span>,<span migi-uid="18">dom</span>txt<span migi-uid="19">dom</span>txt,txt<span migi-uid="21">dom</span>txt<span migi-uid="22">dom</span>,')
  },
  'text2[]': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test li[title="1个变量"]', '')
      .assert.containsText('#test li[title="静态+变量"]', 'before')
      .assert.containsText('#test li[title="变量+静态"]', 'after')
      .assert.containsText('#test li[title="静态+变量+静态"]', 'beforeafter')
      .assert.containsText('#test li[title="变量+变量"]', '')
      .assert.containsText('#test li[title="变量+静态+变量"]', 'middle')
      .assert.containsText('#test li[title="静态+变量+静态+变量+静态"]', 'beforemiddleafter')
      .assert.containsText('#test li[title="变量+DOM"]', '')
      .assert.containsText('#test li[title="DOM+变量"]', '')
      .assert.containsText('#test li[title="DOM+变量+DOM"]', '')
      .assert.containsText('#test li[title="DOM+变量+DOM+变量"]', '')
      .assert.containsText('#test li[title="变量+DOM+变量+DOM"]', '')
      .assert.containsText('#test p[ref="1"]', '1,1,1,1,1,1,1,2,2,3,4,4,')
      .assert.containsText('#test p[ref="2"]', ',before,after,beforeafter,,middle,beforemiddleafter,<span migi-uid="11">dom</span>,<span migi-uid="13">dom</span>,<span migi-uid="15">dom</span><span migi-uid="16">dom</span>,<span migi-uid="18">dom</span><span migi-uid="19">dom</span>,<span migi-uid="21">dom</span><span migi-uid="22">dom</span>,')
  },
  '[]2dom': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test li[title="1个变量"]', 'dom')
      .assert.containsText('#test li[title="静态+变量"]', 'beforedom')
      .assert.containsText('#test li[title="变量+静态"]', 'domafter')
      .assert.containsText('#test li[title="静态+变量+静态"]', 'beforedomafter')
      .assert.containsText('#test li[title="变量+变量"]', 'dom')
      .assert.containsText('#test li[title="变量+静态+变量"]', 'dommiddledom')
      .assert.containsText('#test li[title="静态+变量+静态+变量+静态"]', 'beforedommiddledomafter')
      .assert.containsText('#test li[title="变量+DOM"]', 'domdom')
      .assert.containsText('#test li[title="DOM+变量"]', 'domdom')
      .assert.containsText('#test li[title="DOM+变量+DOM"]', 'domdomdom')
      .assert.containsText('#test li[title="DOM+变量+DOM+变量"]', 'domdomdomdom')
      .assert.containsText('#test li[title="变量+DOM+变量+DOM"]', 'domdomdomdom')
      .assert.containsText('#test p[ref="1"]', '1,2,2,3,2,3,5,2,2,3,4,4,')
      .assert.containsText('#test p[ref="2"]', '<b migi-uid="28">dom</b>,before<b migi-uid="28">dom</b>,<b migi-uid="28">dom</b>after,before<b migi-uid="28">dom</b>after,<b migi-uid="28">dom</b><b migi-uid="28">dom</b>,<b migi-uid="28">dom</b>middle<b migi-uid="28">dom</b>,before<b migi-uid="28">dom</b>middle<b migi-uid="28">dom</b>after,<b migi-uid="28">dom</b><span migi-uid="11">dom</span>,<span migi-uid="13">dom</span><b migi-uid="28">dom</b>,<span migi-uid="15">dom</span><b migi-uid="28">dom</b><span migi-uid="16">dom</span>,<span migi-uid="18">dom</span><b migi-uid="28">dom</b><span migi-uid="19">dom</span><b migi-uid="28">dom</b>,<b migi-uid="28">dom</b><span migi-uid="21">dom</span><b migi-uid="28">dom</b><span migi-uid="22">dom</span>,')
  },
  'dom2[]': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test li[title="1个变量"]', '')
      .assert.containsText('#test li[title="静态+变量"]', 'before')
      .assert.containsText('#test li[title="变量+静态"]', 'after')
      .assert.containsText('#test li[title="静态+变量+静态"]', 'beforeafter')
      .assert.containsText('#test li[title="变量+变量"]', '')
      .assert.containsText('#test li[title="变量+静态+变量"]', 'middle')
      .assert.containsText('#test li[title="静态+变量+静态+变量+静态"]', 'beforemiddleafter')
      .assert.containsText('#test li[title="变量+DOM"]', '')
      .assert.containsText('#test li[title="DOM+变量"]', '')
      .assert.containsText('#test li[title="DOM+变量+DOM"]', '')
      .assert.containsText('#test li[title="DOM+变量+DOM+变量"]', '')
      .assert.containsText('#test li[title="变量+DOM+变量+DOM"]', '')
      .assert.containsText('#test p[ref="1"]', '1,1,1,1,1,1,1,2,2,3,4,4,')
      .assert.containsText('#test p[ref="2"]', ',before,after,beforeafter,,middle,beforemiddleafter,<span migi-uid="11">dom</span>,<span migi-uid="13">dom</span>,<span migi-uid="15">dom</span><span migi-uid="16">dom</span>,<span migi-uid="18">dom</span><span migi-uid="19">dom</span>,<span migi-uid="21">dom</span><span migi-uid="22">dom</span>,')
  },
  '[]2text': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test li[title="1个变量"]', 'txt')
      .assert.containsText('#test li[title="静态+变量"]', 'beforetxt')
      .assert.containsText('#test li[title="变量+静态"]', 'txtafter')
      .assert.containsText('#test li[title="静态+变量+静态"]', 'beforetxtafter')
      .assert.containsText('#test li[title="变量+变量"]', 'txttxt')
      .assert.containsText('#test li[title="变量+静态+变量"]', 'txtmiddletxt')
      .assert.containsText('#test li[title="静态+变量+静态+变量+静态"]', 'beforetxtmiddletxtafter')
      .assert.containsText('#test li[title="变量+DOM"]', 'txtdom')
      .assert.containsText('#test li[title="DOM+变量"]', 'domtxt')
      .assert.containsText('#test li[title="DOM+变量+DOM"]', 'domtxtdom')
      .assert.containsText('#test li[title="DOM+变量+DOM+变量"]', 'domtxtdomtxt')
      .assert.containsText('#test li[title="变量+DOM+变量+DOM"]', 'txtdomtxtdom')
      .assert.containsText('#test p[ref="1"]', '1,1,1,1,1,1,1,2,2,3,4,4,')
      .assert.containsText('#test p[ref="2"]', 'txt,beforetxt,txtafter,beforetxtafter,txttxt,txtmiddletxt,beforetxtmiddletxtafter,txt<span migi-uid="11">dom</span>,<span migi-uid="13">dom</span>txt,<span migi-uid="15">dom</span>txt<span migi-uid="16">dom</span>,<span migi-uid="18">dom</span>txt<span migi-uid="19">dom</span>txt,txt<span migi-uid="21">dom</span>txt<span migi-uid="22">dom</span>,')
  },
  'text2[text]': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test li[title="1个变量"]', 'txt')
      .assert.containsText('#test li[title="静态+变量"]', 'beforetxt')
      .assert.containsText('#test li[title="变量+静态"]', 'txtafter')
      .assert.containsText('#test li[title="静态+变量+静态"]', 'beforetxtafter')
      .assert.containsText('#test li[title="变量+变量"]', 'txttxt')
      .assert.containsText('#test li[title="变量+静态+变量"]', 'txtmiddletxt')
      .assert.containsText('#test li[title="静态+变量+静态+变量+静态"]', 'beforetxtmiddletxtafter')
      .assert.containsText('#test li[title="变量+DOM"]', 'txtdom')
      .assert.containsText('#test li[title="DOM+变量"]', 'domtxt')
      .assert.containsText('#test li[title="DOM+变量+DOM"]', 'domtxtdom')
      .assert.containsText('#test li[title="DOM+变量+DOM+变量"]', 'domtxtdomtxt')
      .assert.containsText('#test li[title="变量+DOM+变量+DOM"]', 'txtdomtxtdom')
      .assert.containsText('#test p[ref="1"]', '1,1,1,1,1,1,1,2,2,3,4,4,')
      .assert.containsText('#test p[ref="2"]', 'txt,beforetxt,txtafter,beforetxtafter,txttxt,txtmiddletxt,beforetxtmiddletxtafter,txt<span migi-uid="11">dom</span>,<span migi-uid="13">dom</span>txt,<span migi-uid="15">dom</span>txt<span migi-uid="16">dom</span>,<span migi-uid="18">dom</span>txt<span migi-uid="19">dom</span>txt,txt<span migi-uid="21">dom</span>txt<span migi-uid="22">dom</span>,')
  },
  '[text]2text': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test li[title="1个变量"]', 'txt')
      .assert.containsText('#test li[title="静态+变量"]', 'beforetxt')
      .assert.containsText('#test li[title="变量+静态"]', 'txtafter')
      .assert.containsText('#test li[title="静态+变量+静态"]', 'beforetxtafter')
      .assert.containsText('#test li[title="变量+变量"]', 'txttxt')
      .assert.containsText('#test li[title="变量+静态+变量"]', 'txtmiddletxt')
      .assert.containsText('#test li[title="静态+变量+静态+变量+静态"]', 'beforetxtmiddletxtafter')
      .assert.containsText('#test li[title="变量+DOM"]', 'txtdom')
      .assert.containsText('#test li[title="DOM+变量"]', 'domtxt')
      .assert.containsText('#test li[title="DOM+变量+DOM"]', 'domtxtdom')
      .assert.containsText('#test li[title="DOM+变量+DOM+变量"]', 'domtxtdomtxt')
      .assert.containsText('#test li[title="变量+DOM+变量+DOM"]', 'txtdomtxtdom')
      .assert.containsText('#test p[ref="1"]', '1,1,1,1,1,1,1,2,2,3,4,4,')
      .assert.containsText('#test p[ref="2"]', 'txt,beforetxt,txtafter,beforetxtafter,txttxt,txtmiddletxt,beforetxtmiddletxtafter,txt<span migi-uid="11">dom</span>,<span migi-uid="13">dom</span>txt,<span migi-uid="15">dom</span>txt<span migi-uid="16">dom</span>,<span migi-uid="18">dom</span>txt<span migi-uid="19">dom</span>txt,txt<span migi-uid="21">dom</span>txt<span migi-uid="22">dom</span>,')
  },
  'text2[dom]': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test li[title="1个变量"]', 'dom')
      .assert.containsText('#test li[title="静态+变量"]', 'beforedom')
      .assert.containsText('#test li[title="变量+静态"]', 'domafter')
      .assert.containsText('#test li[title="静态+变量+静态"]', 'beforedomafter')
      .assert.containsText('#test li[title="变量+变量"]', 'dom')
      .assert.containsText('#test li[title="变量+静态+变量"]', 'dommiddledom')
      .assert.containsText('#test li[title="静态+变量+静态+变量+静态"]', 'beforedommiddledomafter')
      .assert.containsText('#test li[title="变量+DOM"]', 'domdom')
      .assert.containsText('#test li[title="DOM+变量"]', 'domdom')
      .assert.containsText('#test li[title="DOM+变量+DOM"]', 'domdomdom')
      .assert.containsText('#test li[title="DOM+变量+DOM+变量"]', 'domdomdomdom')
      .assert.containsText('#test li[title="变量+DOM+变量+DOM"]', 'domdomdomdom')
      .assert.containsText('#test p[ref="1"]', '1,2,2,3,2,3,5,2,2,3,4,4,')
      .assert.containsText('#test p[ref="2"]', '<b migi-uid="29">dom</b>,before<b migi-uid="29">dom</b>,<b migi-uid="29">dom</b>after,before<b migi-uid="29">dom</b>after,<b migi-uid="29">dom</b><b migi-uid="29">dom</b>,<b migi-uid="29">dom</b>middle<b migi-uid="29">dom</b>,before<b migi-uid="29">dom</b>middle<b migi-uid="29">dom</b>after,<b migi-uid="29">dom</b><span migi-uid="11">dom</span>,<span migi-uid="13">dom</span><b migi-uid="29">dom</b>,<span migi-uid="15">dom</span><b migi-uid="29">dom</b><span migi-uid="16">dom</span>,<span migi-uid="18">dom</span><b migi-uid="29">dom</b><span migi-uid="19">dom</span><b migi-uid="29">dom</b>,<b migi-uid="29">dom</b><span migi-uid="21">dom</span><b migi-uid="29">dom</b><span migi-uid="22">dom</span>,')
  },
  '[dom]2text': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test li[title="1个变量"]', 'txt')
      .assert.containsText('#test li[title="静态+变量"]', 'beforetxt')
      .assert.containsText('#test li[title="变量+静态"]', 'txtafter')
      .assert.containsText('#test li[title="静态+变量+静态"]', 'beforetxtafter')
      .assert.containsText('#test li[title="变量+变量"]', 'txt')
      .assert.containsText('#test li[title="变量+静态+变量"]', 'txtmiddletxt')
      .assert.containsText('#test li[title="静态+变量+静态+变量+静态"]', 'beforetxtmiddletxtafter')
      .assert.containsText('#test li[title="变量+DOM"]', 'txtdom')
      .assert.containsText('#test li[title="DOM+变量"]', 'domtxt')
      .assert.containsText('#test li[title="DOM+变量+DOM"]', 'domtxtdom')
      .assert.containsText('#test li[title="DOM+变量+DOM+变量"]', 'domtxtdomtxt')
      .assert.containsText('#test li[title="变量+DOM+变量+DOM"]', 'txtdomtxtdom')
      .assert.containsText('#test p[ref="1"]', '1,1,1,1,1,1,1,2,2,3,4,4,')
      .assert.containsText('#test p[ref="2"]', 'txt,beforetxt,txtafter,beforetxtafter,txttxt,txtmiddletxt,beforetxtmiddletxtafter,txt<span migi-uid="11">dom</span>,<span migi-uid="13">dom</span>txt,<span migi-uid="15">dom</span>txt<span migi-uid="16">dom</span>,<span migi-uid="18">dom</span>txt<span migi-uid="19">dom</span>txt,txt<span migi-uid="21">dom</span>txt<span migi-uid="22">dom</span>,')
  },
  'text2[text,dom]': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test li[title="1个变量"]', 'txtdom')
      .assert.containsText('#test li[title="静态+变量"]', 'beforetxtdom')
      .assert.containsText('#test li[title="变量+静态"]', 'txtdomafter')
      .assert.containsText('#test li[title="静态+变量+静态"]', 'beforetxtdomafter')
      .assert.containsText('#test li[title="变量+变量"]', 'txtdomtxtdom')
      .assert.containsText('#test li[title="变量+静态+变量"]', 'txtdommiddletxtdom')
      .assert.containsText('#test li[title="静态+变量+静态+变量+静态"]', 'beforetxtdommiddletxtdomafter')
      .assert.containsText('#test li[title="变量+DOM"]', 'txtdomdom')
      .assert.containsText('#test li[title="DOM+变量"]', 'domtxtdom')
      .assert.containsText('#test li[title="DOM+变量+DOM"]', 'domtxtdomdom')
      .assert.containsText('#test li[title="DOM+变量+DOM+变量"]', 'domtxtdomdomtxtdom')
      .assert.containsText('#test li[title="变量+DOM+变量+DOM"]', 'txtdomdomtxtdomdom')
      .assert.containsText('#test p[ref="1"]', '2,2,3,3,4,4,5,3,3,4,6,6,')
      .assert.containsText('#test p[ref="2"]', 'txt<b migi-uid="30">dom</b>,beforetxt<b migi-uid="30">dom</b>,txt<b migi-uid="30">dom</b>after,beforetxt<b migi-uid="30">dom</b>after,txt<b migi-uid="30">dom</b>txt<b migi-uid="30">dom</b>,txt<b migi-uid="30">dom</b>middletxt<b migi-uid="30">dom</b>,beforetxt<b migi-uid="30">dom</b>middletxt<b migi-uid="30">dom</b>after,txt<b migi-uid="30">dom</b><span migi-uid="11">dom</span>,<span migi-uid="13">dom</span>txt<b migi-uid="30">dom</b>,<span migi-uid="15">dom</span>txt<b migi-uid="30">dom</b><span migi-uid="16">dom</span>,<span migi-uid="18">dom</span>txt<b migi-uid="30">dom</b><span migi-uid="19">dom</span>txt<b migi-uid="30">dom</b>,txt<b migi-uid="30">dom</b><span migi-uid="21">dom</span>txt<b migi-uid="30">dom</b><span migi-uid="22">dom</span>,')
  },
  '[text,dom]2dom': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test li[title="1个变量"]', 'dom')
      .assert.containsText('#test li[title="静态+变量"]', 'beforedom')
      .assert.containsText('#test li[title="变量+静态"]', 'domafter')
      .assert.containsText('#test li[title="静态+变量+静态"]', 'beforedomafter')
      .assert.containsText('#test li[title="变量+变量"]', 'dom')
      .assert.containsText('#test li[title="变量+静态+变量"]', 'dommiddledom')
      .assert.containsText('#test li[title="静态+变量+静态+变量+静态"]', 'beforedommiddledomafter')
      .assert.containsText('#test li[title="变量+DOM"]', 'domdom')
      .assert.containsText('#test li[title="DOM+变量"]', 'domdom')
      .assert.containsText('#test li[title="DOM+变量+DOM"]', 'domdomdom')
      .assert.containsText('#test li[title="DOM+变量+DOM+变量"]', 'domdomdomdom')
      .assert.containsText('#test li[title="变量+DOM+变量+DOM"]', 'domdomdomdom')
      .assert.containsText('#test p[ref="1"]', '1,2,2,3,2,3,5,2,2,3,4,4,')
      .assert.containsText('#test p[ref="2"]', '<b migi-uid="31">dom</b>,before<b migi-uid="31">dom</b>,<b migi-uid="31">dom</b>after,before<b migi-uid="31">dom</b>after,<b migi-uid="31">dom</b><b migi-uid="31">dom</b>,<b migi-uid="31">dom</b>middle<b migi-uid="31">dom</b>,before<b migi-uid="31">dom</b>middle<b migi-uid="31">dom</b>after,<b migi-uid="31">dom</b><span migi-uid="11">dom</span>,<span migi-uid="13">dom</span><b migi-uid="31">dom</b>,<span migi-uid="15">dom</span><b migi-uid="31">dom</b><span migi-uid="16">dom</span>,<span migi-uid="18">dom</span><b migi-uid="31">dom</b><span migi-uid="19">dom</span><b migi-uid="31">dom</b>,<b migi-uid="31">dom</b><span migi-uid="21">dom</span><b migi-uid="31">dom</b><span migi-uid="22">dom</span>,')
  },
  'dom2[dom,text]': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test li[title="1个变量"]', 'domtxt')
      .assert.containsText('#test li[title="静态+变量"]', 'beforedomtxt')
      .assert.containsText('#test li[title="变量+静态"]', 'domtxtafter')
      .assert.containsText('#test li[title="静态+变量+静态"]', 'beforedomtxtafter')
      .assert.containsText('#test li[title="变量+变量"]', 'domtxtdomtxt')
      .assert.containsText('#test li[title="变量+静态+变量"]', 'domtxtmiddledomtxt')
      .assert.containsText('#test li[title="静态+变量+静态+变量+静态"]', 'beforedomtxtmiddledomtxtafter')
      .assert.containsText('#test li[title="变量+DOM"]', 'domtxtdom')
      .assert.containsText('#test li[title="DOM+变量"]', 'domdomtxt')
      .assert.containsText('#test li[title="DOM+变量+DOM"]', 'domdomtxtdom')
      .assert.containsText('#test li[title="DOM+变量+DOM+变量"]', 'domdomtxtdomdomtxt')
      .assert.containsText('#test li[title="变量+DOM+变量+DOM"]', 'domtxtdomdomtxtdom')
      .assert.containsText('#test p[ref="1"]', '2,3,2,3,4,4,5,3,3,4,6,6,')
      .assert.containsText('#test p[ref="2"]', '<b migi-uid="31">dom</b>txt,before<b migi-uid="31">dom</b>txt,<b migi-uid="31">dom</b>txtafter,before<b migi-uid="31">dom</b>txtafter,<b migi-uid="31">dom</b>txt<b migi-uid="31">dom</b>txt,<b migi-uid="31">dom</b>txtmiddle<b migi-uid="31">dom</b>txt,before<b migi-uid="31">dom</b>txtmiddle<b migi-uid="31">dom</b>txtafter,<b migi-uid="31">dom</b>txt<span migi-uid="11">dom</span>,<span migi-uid="13">dom</span><b migi-uid="31">dom</b>txt,<span migi-uid="15">dom</span><b migi-uid="31">dom</b>txt<span migi-uid="16">dom</span>,<span migi-uid="18">dom</span><b migi-uid="31">dom</b>txt<span migi-uid="19">dom</span><b migi-uid="31">dom</b>txt,<b migi-uid="31">dom</b>txt<span migi-uid="21">dom</span><b migi-uid="31">dom</b>txt<span migi-uid="22">dom</span>,')
  },
  '[dom,text]2text': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test li[title="1个变量"]', 'txt')
      .assert.containsText('#test li[title="静态+变量"]', 'beforetxt')
      .assert.containsText('#test li[title="变量+静态"]', 'txtafter')
      .assert.containsText('#test li[title="静态+变量+静态"]', 'beforetxtafter')
      .assert.containsText('#test li[title="变量+变量"]', 'txttxt')
      .assert.containsText('#test li[title="变量+静态+变量"]', 'txtmiddletxt')
      .assert.containsText('#test li[title="静态+变量+静态+变量+静态"]', 'beforetxtmiddletxtafter')
      .assert.containsText('#test li[title="变量+DOM"]', 'txtdom')
      .assert.containsText('#test li[title="DOM+变量"]', 'domtxt')
      .assert.containsText('#test li[title="DOM+变量+DOM"]', 'domtxtdom')
      .assert.containsText('#test li[title="DOM+变量+DOM+变量"]', 'domtxtdomtxt')
      .assert.containsText('#test li[title="变量+DOM+变量+DOM"]', 'txtdomtxtdom')
      .assert.containsText('#test p[ref="1"]', '1,1,1,1,1,1,1,2,2,3,4,4,')
      .assert.containsText('#test p[ref="2"]', 'txt,beforetxt,txtafter,beforetxtafter,txttxt,txtmiddletxt,beforetxtmiddletxtafter,txt<span migi-uid="11">dom</span>,<span migi-uid="13">dom</span>txt,<span migi-uid="15">dom</span>txt<span migi-uid="16">dom</span>,<span migi-uid="18">dom</span>txt<span migi-uid="19">dom</span>txt,txt<span migi-uid="21">dom</span>txt<span migi-uid="22">dom</span>,')
  },
  'text2[dom,text]': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test li[title="1个变量"]', 'domtxt')
      .assert.containsText('#test li[title="静态+变量"]', 'beforedomtxt')
      .assert.containsText('#test li[title="变量+静态"]', 'domtxtafter')
      .assert.containsText('#test li[title="静态+变量+静态"]', 'beforedomtxtafter')
      .assert.containsText('#test li[title="变量+变量"]', 'domtxtdomtxt')
      .assert.containsText('#test li[title="变量+静态+变量"]', 'domtxtmiddledomtxt')
      .assert.containsText('#test li[title="静态+变量+静态+变量+静态"]', 'beforedomtxtmiddledomtxtafter')
      .assert.containsText('#test li[title="变量+DOM"]', 'domtxtdom')
      .assert.containsText('#test li[title="DOM+变量"]', 'domdomtxt')
      .assert.containsText('#test li[title="DOM+变量+DOM"]', 'domdomtxtdom')
      .assert.containsText('#test li[title="DOM+变量+DOM+变量"]', 'domdomtxtdomdomtxt')
      .assert.containsText('#test li[title="变量+DOM+变量+DOM"]', 'domtxtdomdomtxtdom')
      .assert.containsText('#test p[ref="1"]', '2,3,2,3,4,4,5,3,3,4,6,6,')
      .assert.containsText('#test p[ref="2"]', '<b migi-uid="33">dom</b>txt,before<b migi-uid="33">dom</b>txt,<b migi-uid="33">dom</b>txtafter,before<b migi-uid="33">dom</b>txtafter,<b migi-uid="33">dom</b>txt<b migi-uid="33">dom</b>txt,<b migi-uid="33">dom</b>txtmiddle<b migi-uid="33">dom</b>txt,before<b migi-uid="33">dom</b>txtmiddle<b migi-uid="33">dom</b>txtafter,<b migi-uid="33">dom</b>txt<span migi-uid="11">dom</span>,<span migi-uid="13">dom</span><b migi-uid="33">dom</b>txt,<span migi-uid="15">dom</span><b migi-uid="33">dom</b>txt<span migi-uid="16">dom</span>,<span migi-uid="18">dom</span><b migi-uid="33">dom</b>txt<span migi-uid="19">dom</span><b migi-uid="33">dom</b>txt,<b migi-uid="33">dom</b>txt<span migi-uid="21">dom</span><b migi-uid="33">dom</b>txt<span migi-uid="22">dom</span>,')
  },
  '[dom,text]2dom': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test li[title="1个变量"]', 'dom')
      .assert.containsText('#test li[title="静态+变量"]', 'beforedom')
      .assert.containsText('#test li[title="变量+静态"]', 'domafter')
      .assert.containsText('#test li[title="静态+变量+静态"]', 'beforedomafter')
      .assert.containsText('#test li[title="变量+变量"]', 'dom')
      .assert.containsText('#test li[title="变量+静态+变量"]', 'dommiddledom')
      .assert.containsText('#test li[title="静态+变量+静态+变量+静态"]', 'beforedommiddledomafter')
      .assert.containsText('#test li[title="变量+DOM"]', 'domdom')
      .assert.containsText('#test li[title="DOM+变量"]', 'domdom')
      .assert.containsText('#test li[title="DOM+变量+DOM"]', 'domdomdom')
      .assert.containsText('#test li[title="DOM+变量+DOM+变量"]', 'domdomdomdom')
      .assert.containsText('#test li[title="变量+DOM+变量+DOM"]', 'domdomdomdom')
      .assert.containsText('#test p[ref="1"]', '1,2,2,3,2,3,5,2,2,3,4,4,')
      .assert.containsText('#test p[ref="2"]', '<b migi-uid="33">dom</b>,before<b migi-uid="33">dom</b>,<b migi-uid="33">dom</b>after,before<b migi-uid="33">dom</b>after,<b migi-uid="33">dom</b><b migi-uid="33">dom</b>,<b migi-uid="33">dom</b>middle<b migi-uid="33">dom</b>,before<b migi-uid="33">dom</b>middle<b migi-uid="33">dom</b>after,<b migi-uid="33">dom</b><span migi-uid="11">dom</span>,<span migi-uid="13">dom</span><b migi-uid="33">dom</b>,<span migi-uid="15">dom</span><b migi-uid="33">dom</b><span migi-uid="16">dom</span>,<span migi-uid="18">dom</span><b migi-uid="33">dom</b><span migi-uid="19">dom</span><b migi-uid="33">dom</b>,<b migi-uid="33">dom</b><span migi-uid="21">dom</span><b migi-uid="33">dom</b><span migi-uid="22">dom</span>,')
  },
  'dom2[text,dom]': function(browser) {
    browser
      .click('#test strong')
      .assert.containsText('#test li[title="1个变量"]', 'txtdom')
      .assert.containsText('#test li[title="静态+变量"]', 'beforetxtdom')
      .assert.containsText('#test li[title="变量+静态"]', 'txtdomafter')
      .assert.containsText('#test li[title="静态+变量+静态"]', 'beforetxtdomafter')
      .assert.containsText('#test li[title="变量+变量"]', 'txtdomtxtdom')
      .assert.containsText('#test li[title="变量+静态+变量"]', 'txtdommiddletxtdom')
      .assert.containsText('#test li[title="静态+变量+静态+变量+静态"]', 'beforetxtdommiddletxtdomafter')
      .assert.containsText('#test li[title="变量+DOM"]', 'txtdomdom')
      .assert.containsText('#test li[title="DOM+变量"]', 'domtxtdom')
      .assert.containsText('#test li[title="DOM+变量+DOM"]', 'domtxtdomdom')
      .assert.containsText('#test li[title="DOM+变量+DOM+变量"]', 'domtxtdomdomtxtdom')
      .assert.containsText('#test li[title="变量+DOM+变量+DOM"]', 'txtdomdomtxtdomdom')
      .assert.containsText('#test p[ref="1"]', '2,2,3,3,4,4,5,3,3,4,6,6,')
      .assert.containsText('#test p[ref="2"]', 'txt<b migi-uid="35">dom</b>,beforetxt<b migi-uid="35">dom</b>,txt<b migi-uid="35">dom</b>after,beforetxt<b migi-uid="35">dom</b>after,txt<b migi-uid="35">dom</b>txt<b migi-uid="35">dom</b>,txt<b migi-uid="35">dom</b>middletxt<b migi-uid="35">dom</b>,beforetxt<b migi-uid="35">dom</b>middletxt<b migi-uid="35">dom</b>after,txt<b migi-uid="35">dom</b><span migi-uid="11">dom</span>,<span migi-uid="13">dom</span>txt<b migi-uid="35">dom</b>,<span migi-uid="15">dom</span>txt<b migi-uid="35">dom</b><span migi-uid="16">dom</span>,<span migi-uid="18">dom</span>txt<b migi-uid="35">dom</b><span migi-uid="19">dom</span>txt<b migi-uid="35">dom</b>,txt<b migi-uid="35">dom</b><span migi-uid="21">dom</span>txt<b migi-uid="35">dom</b><span migi-uid="22">dom</span>,')
      .end()
  }
};