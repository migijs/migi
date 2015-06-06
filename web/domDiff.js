define(function(require, exports, module){var Element=function(){var _0=require('./Element');return _0.hasOwnProperty("Element")?_0.Element:_0.hasOwnProperty("default")?_0["default"]:_0}();
var VirtualDom=function(){var _1=require('./VirtualDom');return _1.hasOwnProperty("VirtualDom")?_1.VirtualDom:_1.hasOwnProperty("default")?_1["default"]:_1}();
var Component=function(){var _2=require('./Component');return _2.hasOwnProperty("Component")?_2.Component:_2.hasOwnProperty("default")?_2["default"]:_2}();
var util=function(){var _3=require('./util');return _3.hasOwnProperty("util")?_3.util:_3.hasOwnProperty("default")?_3["default"]:_3}();

function diffChild(elem, olds, news, prev, index, range, start, index, force) {
  //转成数组方便对比
  if(!Array.isArray(olds)) {
    olds = [olds];
  }
  else {
    olds = util.join(olds);
  }
  if(!Array.isArray(news)) {
    news = [news];
  }
  else {
    news = util.join(news);
  }
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
        //否则重绘插入
        else {
          var s = child.toString();
          var name = /^<([\w-])/.exec(s)[1];
          var node = util.getParent(name);
          node.innerHTML = s;
          elem.replaceChild(node.firstChild, elem.childNodes[start]);
        }
        start++;
      }
      //新vd是text
      else{}
    }
    //老vd是text
    else {
      //新vd是Element
      if(nvd instanceof Element) {
      }
      //新vd是text
      else {
        range.push({ start:start, index:index });
      }
    }
    //TODO: 当是Component的时候
  }
  //老的多余的删除
  for(var j = i, len = olds.length; j < len; j++) {
    elem.removeChild(elem.childNodes[start]);
  }
  //新的多余的插入
  if(i <= news.length - 1) {
    var insert = elem.childNodes[start];
    if(insert) {
      for(var j = news.length - 1; j >= i; j--) {
        var s = news[j].toString();
        var name = /^<([\w-])/.exec(s)[1];
        var node = util.getParent(name);
        node.innerHTML = s;
        elem.insertBefore(node.firstChild, insert);
      }
    }
    else {
      for(var j = i, l = news.length; j < l; j++) {
        var s = news[j].toString();
        var name = /^<([\w-])/.exec(s)[1];
        var node = util.getParent(name);
        node.innerHTML = s;
        elem.appendChild(node.firstChild);
      }
    }
  }
  return { start:start, prev:prev };
}

function diff(ovd, nvd) {
  //相同引用说明没发生变更，在一些使用常量、变量未变的情况下会如此
  if(ovd === nvd) {
    return;
  }
  //特殊的uid，以及将真实DOM引用赋给新vd
  var elem = ovd.element;
  elem.setAttribute('migi-uid', nvd.uid);
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
  var start = 0;
  var range = [];
  var prev;
  //遍历孩子，长度取新老vd最小值
  for(var index = 0, len = Math.min(ovd.children.length, nvd.children.length); index < len; index++) {
    var oc = ovd.children[index];
    var nc = nvd.children[index];
    //vd的child可能是vd、文本、变量和数组，但已不可能是Obj
    var temp = diffChild(elem, oc, nc, prev, index, range, start, index);
    start = temp.start;
    prev = temp.prev;
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