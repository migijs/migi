define(function(require, exports, module){var Event=function(){var _0=require('./Event');return _0.hasOwnProperty("default")?_0["default"]:_0}();
var Element=function(){var _1=require('./Element');return _1.hasOwnProperty("default")?_1["default"]:_1}();
var util=function(){var _2=require('./util');return _2.hasOwnProperty("default")?_2["default"]:_2}();
var range=function(){var _3=require('./range');return _3.hasOwnProperty("default")?_3["default"]:_3}();
var cachePool=function(){var _4=require('./cachePool');return _4.hasOwnProperty("default")?_4["default"]:_4}();
var type=function(){var _5=require('./type');return _5.hasOwnProperty("default")?_5["default"]:_5}();

var DOM_TO_TEXT = 0;
var DOM_TO_DOM = 1;
var TEXT_TO_DOM = 2;
var TEXT_TO_TEXT = 3;

function replaceWith(elem, cns, index, vd, isText) {
  var node = isText ? util.NODE : util.getParent(vd.name);
  var s = vd === void 0 || vd === null ? '' : vd.toString();
  var target;
  if(s) {
    node.innerHTML = isText ? util.encodeHtml(s) : s;
    target = node.firstChild;
  }
  else {
    target = document.createTextNode('');
  }
  if(index >= cns.length) {
    elem.appendChild(target);
  }
  else {
    elem.replaceChild(target, cns[index]);
  }
  if(!isText) {
    //别忘了触发DOM事件
    vd.emit(Event.DOM);
  }
}
function insertAt(elem, cns, index, vd, isText) {
  var node = isText ? util.NODE : util.getParent(vd.name);
  var s = vd === void 0 || vd === null ? '' : vd.toString();
  var target;
  if(s) {
    node.innerHTML = isText ? util.encodeHtml(s) : s;
    target = node.firstChild;
  }
  else {
    target = document.createTextNode('');
  }
  if(index >= cns.length) {
    elem.appendChild(target);
  }
  else {
    elem.insertBefore(target, cns[index]);
  }
  if(!isText) {
    //别忘了触发DOM事件
    vd.emit(Event.DOM);
  }
}

function add(elem, nvd, ranges, option, history) {
  //可能第1个老的是空数组
  if(option.first) {
    var isDOM = nvd instanceof Element;
    replaceWith(elem, elem.childNodes, 0, nvd, !isDOM);
    option.state = isDOM ? TEXT_TO_DOM : TEXT_TO_TEXT;
    if(!isDOM) {
      range.record(history, option);
    }
  }
  else {
    if(nvd instanceof Element) {
      insertAt(elem, elem.childNodes, option.start++, nvd);
      option.state = DOM_TO_DOM;
    }
    else {
      switch(option.state) {
        case DOM_TO_TEXT:
        case TEXT_TO_TEXT:
          addRange(ranges, option);
          break;
        case DOM_TO_DOM:
        case TEXT_TO_DOM:
          insertAt(elem, elem.childNodes, option.start, nvd, true);
          break;
      }
      option.state = TEXT_TO_TEXT;
    }
  }
  option.first = false;
}
function del(elem, ovd, ranges, option, history) {
  //可能第1个新的是空数组
  if(option.first) {
    elem.removeChild(elem.childNodes[0]);
    var isDOM = ovd instanceof Element;
    option.state = isDOM ? TEXT_TO_TEXT : DOM_TO_TEXT;
    if(!isDOM) {
      range.record(history, option);
    }
  }
  else {
    if(ovd instanceof Element) {
      elem.removeChild(elem.childNodes[option.start]);
      //缓存对象池
      cachePool.add(ovd.__destroy());
    }
    else {
      switch(option.state) {
        case DOM_TO_TEXT:
          elem.removeChild(elem.childNodes[option.start + 1]);
        case TEXT_TO_TEXT:
        case DOM_TO_DOM:
          addRange(ranges, option);
          break;
        case TEXT_TO_DOM:
          elem.removeChild(elem.childNodes[option.start]);
          break;
      }
    }
  }
}

function equalText(a, b) {
  if(a === void 0 || a === null) {
    a = '';
  }
  if(b === void 0 || b === null) {
    b = '';
  }
  return a.toString() == b.toString();
}

function addRange(ranges, option) {
  ranges.push({ start: option.start, index: option.record.slice() });
}

function diffVd(ovd, nvd) {
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
  var option = { start: 0, record: [], first: true };
  var history;
  //遍历孩子，长度取新老vd最小值
  for(var index = 0, len = Math.min(ovd.children.length, nvd.children.length); index < len; index++) {
    var oc = ovd.children[index];
    var nc = nvd.children[index];
    //history记录着当前child索引，可能它是个数组，递归记录
    history = [index];
    //vd的child可能是vd、文本、变量和数组，但已不可能是Obj
    diffChild(elem, oc, nc, ranges, option, history);
  }
  range.merge(ranges);
  if(ranges.length) {
    ranges.forEach(function(item) {
      range.update(item, nvd.children, elem);
    });
  }
  //缓存对象池
  cachePool.add(ovd.__destroy());
}

exports.diff=diff;function diff(elem, ov, nv, ranges, option, history) {
  //hack之前的状态，非Obj其实没有发生变更，假设自己变自己的状态
  if(!option.first) {
    if(option.prev == type.TEXT) {
      option.state = TEXT_TO_TEXT;
    }
    else {
      option.state = DOM_TO_DOM;
    }
  }
  diffChild(elem, ov, nv, ranges, option, history);
  //当最后一次对比是TEXT变为DOM时记录，因为随后的text可能要更新
  if(option.state == TEXT_TO_DOM) {
    option.t2d = true;
  }
  else if(option.state == DOM_TO_TEXT) {
    option.d2t = true;
  }
}

function diffChild(elem, ovd, nvd, ranges, option, history) {
  //新老值是否是数组处理方式不同
  var oa = Array.isArray(ovd);
  var na = Array.isArray(nvd);
  //都是数组时，还要检查二者长度
  if(oa && na) {
    var ol = ovd.length;
    var nl = nvd.length;
    var os = ol ? 1 : 0;
    var ns = nl ? 2 : 0;
    history.push(0);
    if(option.first) {
      range.record(history, option);
    }
    switch(os + ns) {
      //都是空数组
      case 0:
        option.state = TEXT_TO_TEXT;
        option.prev = type.TEXT;
        break;
      //有内容的数组变为空数组
      case 1:
        diffChild(elem, ovd[0], nvd[0], ranges, option, history);
        for(var i = 1; i < ol; i++) {
          del(elem, ovd[i], ranges, option, history);
        }
        break;
      //空数组变为有内容
      case 2:
        diffChild(elem, ovd[0], nvd[0], ranges, option, history);
        for(var i = 1; i < nl; i++) {
          add(elem, nvd[i], ranges, option, history);
        }
        break;
      //都有内容
      case 3:
        for(var i = 0, len = Math.min(ol, nl); i < len; i++) {
          history[history.length - 1] = i;
          diffChild(elem, ovd[i], nvd[i], ranges, option, history);
        }
        //老的多余的删除
        for(var j = i; j < ol; j++) {
          del(elem, ovd[j], ranges, option, history);
        }
        //新的多余的插入
        for(var j = i; j < nl; j++) {
          add(elem, nvd[j], ranges, option, history);
        }
        break;
    }
    history.pop();
  }
  //老的是数组新的不是
  else if(oa) {
    var length = ovd.length;
    //将老的第1个和新的相比，注意老的第一个可能还是个数组，递归下去
    if(length) {
      diffChild(elem, ovd[0], nvd, ranges, option, history);
      //移除剩余的老的
      for(var i = 1; i < length; i++) {
        del(elem, ovd[i], ranges, option, history);
      }
    }
    //老的是个空数组，相当于空TEXT
    else {
      //新的是DOM
      if(nvd instanceof Element) {
        var cns = elem.childNodes;
        //本身就是第1个，直接替换
        if(option.first) {
          replaceWith(elem, cns, option.start++, nvd);
        }
        else {
          switch(option.state) {
            case DOM_TO_TEXT:
            case DOM_TO_DOM:
              replaceWith(elem, cns, option.start++, nvd);
              break;
            case TEXT_TO_DOM:
              insertAt(elem, cns, option.start++, nvd);
              break;
            case TEXT_TO_TEXT:
              insertAt(elem, cns, ++option.start, nvd);
              break;
          }
        }
        option.state = TEXT_TO_DOM;
      }
      //新的是TEXT
      else {
        option.state = TEXT_TO_TEXT;
        if(option.first) {
          range.record(history, option);
          if(ovd != nvd) {
            if((ovd !== void 0 || nvd !== '')
              && (ovd !== '' || nvd !== void 0)) {
              addRange(ranges, option);
            }
          }
        }
        else {
          var cns = elem.childNodes;
          switch(option.state) {
            case DOM_TO_TEXT:
              addRange(ranges, option);
              elem.removeChild(cns[option.start + 1]);
              break;
            case TEXT_TO_DOM:
              insertAt(elem, cns, option.start, nvd, true);
              break;
            case DOM_TO_DOM:
            case TEXT_TO_TEXT:
              if(ovd != nvd) {
                if((ovd !== void 0 || nvd !== '')
                  && (ovd !== '' || nvd !== void 0)) {
                  addRange(ranges, option);
                }
              }
              break;
          }
        }
      }
    }
  }
  //新的是数组老的不是
  else if(na) {
    var length = nvd.length;
    //将新的第1个和老的相比，注意新的第一个可能还是个数组，递归下去
    if(length) {
      diffChild(elem, ovd, nvd[0], ranges, option, history);
      //增加剩余的新的
      for(var i = 1; i < length; i++) {
        add(elem, nvd[i], ranges, option, history);
      }
    }
    //新的是个空数组，相当于空TEXT
    else {
      //老的是DOM
      if(ovd instanceof Element) {
        var cns = elem.childNodes;
        //本身就是第1个，直接替换
        if(option.first) {
          range.record(history, option);
          replaceWith(elem, cns, option.start, nvd, true);
        }
        else {
          switch(option.state) {
            case DOM_TO_TEXT:
            case TEXT_TO_TEXT:
              elem.removeChild(cns[option.start + 1]);
              addRange(ranges, option);
              break;
            case TEXT_TO_DOM:
              replaceWith(elem, cns, option.start++, nvd, true);
              break;
            case DOM_TO_DOM:
              replaceWith(elem, cns, option.start, nvd, true);
              break;
          }
        }
      }
    }
  }
  //都不是数组
  else {
    var oe = ovd instanceof Element ? 1 : 0;
    var ne = nvd instanceof Element ? 2 : 0;
    //新老值是否为DOM或TEXT分4种情况
    switch(oe + ne) {
      //都是text时，根据上个节点类型和history设置range
      case 0:
        range.record(history, option);
        var cns = elem.childNodes;
        if(option.first) {
          if(!equalText(ovd, nvd)) {
            addRange(ranges, option);
          }
        }
        else if(!equalText(ovd, nvd)) {
          switch(option.state) {
            case DOM_TO_TEXT:
              addRange(ranges, option);
              elem.removeChild(cns[option.start + 1]);
              break;
            case TEXT_TO_DOM:
              insertAt(elem, cns, option.start, nvd, true);
              break;
            case DOM_TO_DOM:
              range.record(history, option);
            case TEXT_TO_TEXT:
              if(!equalText(ovd, nvd)) {
                addRange(ranges, option);
              }
              break;
          }
        }
        //不是第一个但text内容不变时，需根据之前的状态判断处理
        else {
          switch(option.state) {
            case TEXT_TO_DOM:
              insertAt(elem, cns, option.start, nvd, true);
              break;
          }
        }
        option.state = TEXT_TO_TEXT;
        option.prev = type.TEXT;
        break;
      //DOM变TEXT
      case 1:
        range.record(history, option);
        var cns = elem.childNodes;
        //本身就是第1个，直接替换
        if(option.first) {
          replaceWith(elem, cns, option.start, nvd, true);
        }
        else {
          switch(option.state) {
            case DOM_TO_TEXT:
            case TEXT_TO_TEXT:
              addRange(ranges, option);
              elem.removeChild(cns[option.start + 1]);
              break;
            case TEXT_TO_DOM:
              replaceWith(elem, cns, option.start++, nvd, true);
              break;
            case DOM_TO_DOM:
              replaceWith(elem, cns, option.start, nvd, true);
              break;
          }
        }
        option.state = DOM_TO_TEXT;
        option.prev = type.TEXT;
        break;
      //TEXT变DOM
      case 2:
        var cns = elem.childNodes;
        if(option.first) {
          replaceWith(elem, cns, option.start++, nvd);
        }
        else {
          switch(option.state) {
            case DOM_TO_TEXT:
              option.start++;
            case DOM_TO_DOM:
              replaceWith(elem, cns, option.start++, nvd);
              break;
            case TEXT_TO_DOM:
              insertAt(elem, cns, option.start++, nvd);
              break;
            case TEXT_TO_TEXT:
              addRange(ranges, option);
              insertAt(elem, cns, ++option.start, nvd);
              option.start++;
              break;
          }
        }
        option.state = TEXT_TO_DOM;
        option.prev = type.DOM;
        break;
      //DOM变DOM
      case 3:
        //DOM名没变递归diff
        if(ovd.name == nvd.name) {
          diffVd(ovd, nvd);
        }
        //否则重绘替换
        else {
          var node = util.getParent(nvd.name);
          node.innerHTML = nvd.toString();
          elem.replaceChild(node.firstChild, elem.childNodes[option.start]);
        }
        option.state = DOM_TO_DOM;
        option.prev = type.DOM;
        option.start++;
        break;
    }
  }
  option.first = false;
}

exports.check=check;function check(option, elem, vd, ranges) {
  if(option.t2d) {
    delete option.t2d;
    insertAt(elem, elem.childNodes, option.start++, vd, true);
  }
  else if(option.d2t) {
    delete option.d2t;
    del(elem, vd, ranges, option);
  }
}});