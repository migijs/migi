define(function(require, exports, module){var Element=function(){var _0=require('./Element');return _0.hasOwnProperty("default")?_0["default"]:_0}();
var VirtualDom=function(){var _1=require('./VirtualDom');return _1.hasOwnProperty("default")?_1["default"]:_1}();
var Component=function(){var _2=require('./Component');return _2.hasOwnProperty("default")?_2["default"]:_2}();
var util=function(){var _3=require('./util');return _3.hasOwnProperty("default")?_3["default"]:_3}();
var range=function(){var _4=require('./range');return _4.hasOwnProperty("default")?_4["default"]:_4}();

var DOM_TO_TEXT = 0;
var DOM_TO_DOM = 1;
var TEXT_TO_DOM = 2;
var TEXT_TO_TEXT = 3;
var DOM_TO_NONE = 4;
var TEXT_TO_NONE = 5;
var NONE_TO_DOM = 6;
var NONE_TO_TEXT = 7;

function replaceWith(elem, index, vd, isText) {
  var node = isText ? util.NODE : util.getParent(vd.name);
  node.innerHTML = isText ? util.encodeHtml(vd.toString()) : vd.toString();
  var cns = elem.childNodes;
  if(index >= cns.length) {
    elem.appendChild(node.firstChild);
  }
  else {
    elem.replaceChild(node.firstChild, cns[index]);
  }
}
function insertAt(elem, index, vd, isText) {
  var node = isText ? util.NODE : util.getParent(vd.name);
  node.innerHTML = isText ? util.encodeHtml(vd.toString()) : vd.toString();
  var cns = elem.childNodes;
  if(index >= cns.length) {
    elem.appendChild(node.firstChild);
  }
  else {
    elem.insertBefore(node.firstChild, cns[index]);
  }
}

function diffChild(elem, olds, news, index, ranges, option) {
  for(var i = 0, len = Math.min(olds.length, news.length); i < len; i++) {
    var ovd = olds[i];
    var nvd = news[i];
    //老vd是Element
    if(ovd instanceof Element) {
      //新vd是Element
      if(nvd instanceof Element) {
        //同类型节点更新之
        if(ovd.name == nvd.name) {
          diff(ovd, nvd);
        }
        //否则重绘替换
        else {
          replaceWith(elem, option.start, nvd);
          //别忘了触发DOM事件
          nvd.emit(Event.DOM);
        }
        option.start++;
        option.state = DOM_TO_DOM;
      }
      //新vd是text
      else {
        //非第1个
        if(index || i) {
          switch(changeList[changeList.length - 1]) {
            case DOM_TO_TEXT:
            case TEXT_TO_TEXT:
              elem.removeChild(elem.childNodes[option.start + 1]);
              ranges.push({ start: option.start, index:index, i:i });
              break;
            case TEXT_TO_DOM:
              replaceWith(elem, option.start++, nvd, true);
              break;
            case DOM_TO_DOM:
              replaceWith(elem, option.start, nvd, true);
              break;
          }
        }
        //本身就是第1个，直接替换
        else {
          replaceWith(elem, option.start, nvd, true);
        }
        option.state = DOM_TO_TEXT;
      }
    }
    //老vd是text
    else {
      //新vd是Element
      if(nvd instanceof Element) {
        //非第1个
        if(index || i) {
          switch(changeList[changeList.length - 1]) {
            case DOM_TO_TEXT:
            case DOM_TO_DOM:
              replaceWith(elem, option.start++, nvd);
              break;
            case TEXT_TO_DOM:
              insertAt(elem, option.start++, nvd);
              break;
            case TEXT_TO_TEXT:
              insertAt(elem, ++option.start, nvd);
              break;
          }
        }
        //本身就是第1个，直接替换
        else {
          replaceWith(elem, option.start++, nvd);
          //别忘了触发DOM事件
          nvd.emit(Event.DOM);
        }
        option.state = TEXT_TO_DOM;
      }
      //新vd是text，进行文本对比更新
      //注意用弱类型，字符串和数字弱相等即可；undefined和空字符串也相等
      else {
        option.state = TEXT_TO_TEXT;
        if(index || i) {
          switch(changeList[changeList.length - 1]) {
            case DOM_TO_TEXT:
              ranges.push({ start: option.start, index:index, i:i });
              elem.removeChild(elem.childNodes[option.start + 1]);
              break;
            case TEXT_TO_DOM:
              insertAt(elem, option.start, nvd, true);
              break;
            case DOM_TO_DOM:
            case TEXT_TO_TEXT:
              if(ovd == nvd) {
                continue;
              }
              if(ovd === void 0 && nvd === ''
                || ovd === '' && nvd === void 0) {
                continue;
              }
              ranges.push({ start:option.start, index:index, i:i });
              break;
          }
        }
        else {
          if(ovd == nvd) {
            continue;
          }
          if(ovd === void 0 && nvd === ''
            || ovd === '' && nvd === void 0) {
            continue;
          }
          ranges.push({ start: option.start, index:index, i:i });
        }
      }
    }
    //TODO: 当是Component的时候
  }
  //老的多余的删除
  if(i < olds.length) {
    for(var j = i, len = olds.length; j < len; j++) {
      var vd = olds[j];
      if(index || i) {
        if(VirtualDom.isText(vd)) {
          switch(changeList[changeList.length - 1]) {
            case DOM_TO_TEXT:
            case TEXT_TO_TEXT:
            case TEXT_TO_NONE:
              ranges.push({ start:option.start, index:index, i: j });
              break;
            case DOM_TO_DOM:
            case TEXT_TO_DOM:
            case DOM_TO_NONE:
            case NONE_TO_DOM:
              elem.removeChild(elem.childNodes[option.start]);
              break;
          }
        }
        else {
          switch(changeList[changeList.length - 1]) {
            case DOM_TO_TEXT:
              elem.removeChild(elem.childNodes[option.start]);
              break;
          }
        }
      }
      //可能第1个新的是空数组
      else {
        elem.removeChild(elem.childNodes[0]);
        option.state = VirtualDom.isText(vd) ? TEXT_TO_NONE : DOM_TO_NONE;
      }
    }
  }
  //新的多余的插入
  else if(i < news.length) {
    for(var j = i, len = news.length; j < len; j++) {
      var vd = news[j];
      if(index || i) {
        if(VirtualDom.isText(vd)) {
          switch(changeList[changeList.length - 1]) {
            case DOM_TO_TEXT:
            case TEXT_TO_TEXT:
            case TEXT_TO_NONE:
            case NONE_TO_TEXT:
              ranges.push({ start: option.start, index:index, i: j });
              break;
            case DOM_TO_DOM:
            case TEXT_TO_DOM:
            case DOM_TO_NONE:
            case NONE_TO_DOM:
              insertAt(elem, option.start, vd, true);
              break;
          }
        }
        else {
          insertAt(elem, option.start++, vd);
        }
      }
      //可能第1个老的是空数组
      else {
        replaceWith(elem, 0, vd, VirtualDom.isText(vd));
        option.state = VirtualDom.isText(vd) ? TEXT_TO_TEXT : TEXT_TO_DOM;
      }
    }
  }
}

function diff(ovd, nvd) {
  //相同引用说明没发生变更，在一些使用常量、变量未变的情况下会如此
  if(ovd === nvd) {
    return;
  }
  //特殊的uid，以及将真实DOM引用赋给新vd
  var elem = ovd.element;
  nvd.__uid = ovd.uid;
  nvd.__element = elem;
  //删除老参数，添加新参数
  var ok = Object.keys(ovd.props);
  var nk = Object.keys(nvd.props);
  //记录对比过的prop
  var hash = {};
  ok.forEach(function(prop) {
    //TODO: 侦听引用对比
    if(/^on[A-Z]/.test(prop)) {
      //TODO: removeEventListener参数
      var name = prop.slice(2).replace(/[A-Z]/g, function(Up) {
        return Up.toLowerCase();
      });
      elem.removeEventListener(name);
    }
    else {
      hash[prop] = true;
      //对比老属性，相同无需更新
      var v = ovd.props[prop];
      var n = nvd.props[prop];
      if(v !== n) {
        ovd.__updateAttr(prop, n);
      }
    }
  });
  //添加新vd的属性
  nk.forEach(function(prop) {
    //TODO: onXxx
    if(!hash.hasOwnProperty(prop)) {
      nvd.__updateAttr(prop, nvd.props[prop]);
    }
  });
  //渲染children
  var ranges = [];
  var list = [];
  var option = { start : 0 };
  //遍历孩子，长度取新老vd最小值
  for(var index = 0, len = Math.min(ovd.children.length, nvd.children.length); index < len; index++) {
    var oc = ovd.children[index];
    var nc = nvd.children[index];
    //vd的child可能是vd、文本、变量和数组，但已不可能是Obj
    //将array平铺开来，非array变array
    var olds = Array.isArray(oc) ? util.join(oc) : [oc];
    var news = Array.isArray(nc) ? util.join(nc) : [nc];
    //diff孩子节点
    diffChild(elem, olds, news, index, ranges, option);
    list.push(news);
  }
  range.merge(ranges);
  if(ranges.length) {
    ranges.forEach(function(item) {
      range.update(item, nvd, list, elem);
    });
  }
}

exports["default"]=function(ovd, nvd) {
  //TODO: 可能可以用对象池技术来缓存废弃的vd，避免重复创建消耗，需改lefty编译优化
  //fix循环依赖
  if(Element.hasOwnProperty('default')) {
    Element = Element['default'];
  }
  if(VirtualDom.hasOwnProperty('default')) {
    VirtualDom = VirtualDom['default'];
  }
  if(Component.hasOwnProperty('default')) {
    Component = Component['default'];
  }
  diff(ovd, nvd);
}});