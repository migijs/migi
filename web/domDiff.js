define(function(require, exports, module){var Event=function(){var _0=require('./Event');return _0.hasOwnProperty("default")?_0["default"]:_0}();
var Element=function(){var _1=require('./Element');return _1.hasOwnProperty("default")?_1["default"]:_1}();
var Component=function(){var _2=require('./Component');return _2.hasOwnProperty("default")?_2["default"]:_2}();
var Cb=function(){var _3=require('./Cb');return _3.hasOwnProperty("default")?_3["default"]:_3}();
var util=function(){var _4=require('./util');return _4.hasOwnProperty("default")?_4["default"]:_4}();
var range=function(){var _5=require('./range');return _5.hasOwnProperty("default")?_5["default"]:_5}();
var cachePool=function(){var _6=require('./cachePool');return _6.hasOwnProperty("default")?_6["default"]:_6}();
var type=function(){var _7=require('./type');return _7.hasOwnProperty("default")?_7["default"]:_7}();

var DOM_TO_TEXT = 0;
var DOM_TO_DOM = 1;
var TEXT_TO_DOM = 2;
var TEXT_TO_TEXT = 3;

function replaceWith(elem, cns, index, vd, isText) {
  //insertAdjacentHTML在插入text时浏览器行为表现不一致，ff会合并相邻text，chrome则不会
  //因此DOM使用insertAdjacentHTML，text则用textNode
  var target;
  if(isText) {
    var s = vd === void 0 || vd === null ? '' : vd.toString();
    if(s) {
      var node = util.NODE;
      node.innerHTML = util.encodeHtml(s);
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
    if(vd instanceof migi.NonVisualComponent) {
      vd.emit(Event.DOM);
    }
  }
  else {
    target = vd.toString();
    if(index >= cns.length) {
      elem.insertAdjacentHTML('beforeend', target);
    }
    else {
      //textNode没有insertAdjacentHTML方法，必须使用replaceChild
      if(cns[index].nodeType == 1) {
        cns[index].insertAdjacentHTML('afterend', target);
        elem.removeChild(cns[index]);
      }
      else {
        var node = util.getParent(vd.$name);
        node.innerHTML = target;
        elem.replaceChild(node.firstChild, cns[index]);
      }
    }
    //别忘了触发DOM事件
    vd.emit(Event.DOM);
  }
}
function insertAt(elem, cns, index, vd, isText) {
  var target;
  if(isText) {
    var s = vd === void 0 || vd === null ? '' : vd.toString();
    if(s) {
      var node = util.NODE;
      node.innerHTML = util.encodeHtml(s);
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
    if(vd instanceof migi.NonVisualComponent) {
      vd.emit(Event.DOM);
    }
  }
  else {
    target = vd.toString();
    if(index >= cns.length) {
      elem.insertAdjacentHTML('beforeend', target);
    }
    else {
      if(cns[index].nodeType == 1) {
        cns[index].insertAdjacentHTML('beforebegin', target);
      }
      else {
        var node = util.getParent(vd.$name);
        node.innerHTML = target;
        elem.insertBefore(node.firstChild, cns[index]);
      }
    }
    //别忘了触发DOM事件
    vd.emit(Event.DOM);
  }
}

function add(elem, vd, ranges, option, history, temp, last) {
  if(Array.isArray(vd)) {
    history.push(0);
    //防止空数组跳过的情况
    for(var i = 0, len = Math.max(vd.length, 1); i < len; i++) {
      var item = vd[i];
      history[history.length - 1] = i;
      add(elem, item, ranges, option, history, temp, last && i == len - 1);
    }
    history.pop();
  }
  else if(vd instanceof Element && !(vd instanceof migi.NonVisualComponent)) {
    if(temp.hasOwnProperty('prev')) {
      if(option.prev == type.TEXT) {
        option.start++;
      }
      insertAt(elem, elem.childNodes, option.start++, vd);
      if(last) {
        //根据add之前最后一次情况决定下次text判断的特殊逻辑
        switch(temp.state) {
          case TEXT_TO_TEXT:
          case DOM_TO_TEXT:
            option.t2d = true;
            break;
          default:
            delete option.d2t;
        }
      }
    }
    else {
      temp.state = option.state;
      switch(option.state) {
        case DOM_TO_TEXT:
          option.start++;
          //d(t) -> td(t)
          break;
        case TEXT_TO_TEXT:
          addRange(ranges, option);
          option.start++;
          //t(t) -> td(t)
          option.t2d = true;
          break;
        case TEXT_TO_DOM:
          //t(t) -> dd(t)
          option.t2d = true;
          break;
        //case DOM_TO_DOM:
        //d(t) -> dd(t)
      }
      insertAt(elem, elem.childNodes, option.start++, vd);
    }
    temp.d = true;
    temp.prev = option.prev = type.DOM;
    option.state = DOM_TO_DOM;
  }
  else {
    if(temp.hasOwnProperty('prev')) {
      if(option.prev == type.DOM) {
        range.record(history, option);
        insertAt(elem, elem.childNodes, option.start, vd, true);
      }
      else {
        addRange(ranges, option);
      }
      //不仅last，还要判断是否插入过d的情况
      if(last && temp.d) {
        addRange(ranges, option);
        //根据add之前最后一次情况决定下次text判断的特殊逻辑
        switch(temp.state) {
          case DOM_TO_DOM:
          case TEXT_TO_DOM:
            delete option.t2d;
            break;
          default:
            delete option.d2t;
        }
      }
    }
    else {
      check(option, elem, vd, ranges, history);
      temp.state = option.state;
      switch(option.state) {
        case DOM_TO_TEXT:
          //d(t) -> tt(t)
          option.d2t = true;
        case TEXT_TO_TEXT:
          addRange(ranges, option);
          //t(t) -> tt(t)
          break;
        case TEXT_TO_DOM:
          range.record(history, option);
          insertAt(elem, elem.childNodes, option.start, vd, true);
          addRange(ranges, option);
          //t(t) -> dt(t)
          break;
        case DOM_TO_DOM:
          range.record(history, option);
          insertAt(elem, elem.childNodes, option.start, vd, true);
          //d(t) -> dt(t)
          option.d2t = true;
          break;
      }
    }
    temp.prev = option.prev = type.TEXT;
    option.state = TEXT_TO_TEXT;
  }
}
function del(elem, vd, ranges, option, temp, last) {
  if(Array.isArray(vd)) {
    var len = vd.length;
    vd.forEach(function(item, i) {
      del(elem, item, ranges, option, temp, last && i == len - 1);
    });
  }
  else if(vd instanceof Element && !(vd instanceof migi.NonVisualComponent)) {
    if(temp.hasOwnProperty('prev')) {
      //刚删过t的话再d索引+1，并且还删过d则连带中间多余的t一并删除
      if(temp.prev == type.TEXT) {
        if(temp.d) {
          removeAt(elem, option.start + 1);
        }
        removeAt(elem, option.start + 1);
      }
      //刚删过d的话，检查之前最后的节点状态判别索引是否要+1
      else {
        if(option.prev == type.TEXT) {
          removeAt(elem, option.start + 1);
        }
        else {
          removeAt(elem, option.start);
        }
      }
      if(last) {
        //根据del之前最后一次情况决定下次text判断的特殊逻辑
        switch(option.state) {
          case TEXT_TO_TEXT:
          case DOM_TO_TEXT:
            option.d2t = true;
            break;
          default:
            delete option.t2d;
            break;
        }
      }
    }
    else {
      switch(option.state) {
        case DOM_TO_TEXT:
          removeAt(elem, option.start + 1);
          option.state = TEXT_TO_TEXT;
          option.prev = type.TEXT;
          //dd(t) -> t(t)
          option.d2t = true;
          break;
        case TEXT_TO_TEXT:
          removeAt(elem, option.start + 1);
          option.prev = type.TEXT;
          //td(t) -> t(t)
          option.d2t = true;
          break;
        case TEXT_TO_DOM:
          removeAt(elem, option.start);
          option.state = DOM_TO_DOM;
          option.prev = type.DOM;
          //td(t) -> d(t)
          break;
        case DOM_TO_DOM:
          removeAt(elem, option.start);
          option.prev = type.DOM;
          //dd(t) -> d(t)
          break;
      }
    }
    temp.d = true;
    temp.prev = type.DOM;
    //缓存对象池
    cachePool.add(vd.__destroy());
  }
  else {
    if(temp.hasOwnProperty('prev')) {
      if(temp.prev == type.DOM) {
        addRange(ranges, option);
      }
      //不仅last，还要判断是否删除过d的情况
      if(last && temp.d) {
        removeAt(elem, option.start + 1);
        //根据del之前最后一次情况决定下次text判断的特殊逻辑
        switch(option.state) {
          case DOM_TO_DOM:
          case TEXT_TO_DOM:
            option.t2d = true;
            break;
          default:
            delete option.d2t;
        }
      }
    }
    else {
      switch(option.state) {
        case DOM_TO_TEXT:
          removeAt(elem, option.start + 1);
          addRange(ranges, option);
          option.state = TEXT_TO_TEXT;
          option.prev = type.TEXT;
          //dt(t) -> t(t)
          break;
        case TEXT_TO_TEXT:
          addRange(ranges, option);
          option.prev = type.TEXT;
          //tt(t) -> t(t)
          break;
        case DOM_TO_DOM:
          removeAt(elem, option.start);
          option.state = DOM_TO_DOM;
          option.prev = type.DOM;
          //dt(t) -> d(t)
          option.t2d = true;
          break;
        case TEXT_TO_DOM:
          option.prev = type.DOM;
          //tt(t) -> d(t)
          option.t2d = true;
          break;
      }
    }
    temp.prev = type.TEXT;
  }
}
function removeAt(elem, start) {
  elem.removeChild(elem.childNodes[start]);
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
  var len = ranges.length;
  if(!len || ranges[len - 1].start < option.start) {
    ranges.push({ start: option.start, index: option.record.slice() });
  }
}

function diffVd(ovd, nvd) {
  //相同引用说明没发生变更，在一些使用常量、变量未变的情况下会如此
  if(ovd === nvd) {
    return;
  }
  //特殊的uid，以及将真实DOM引用赋给新vd
  var elem = ovd.$element;
  nvd.__uid = ovd.$uid;
  nvd.__element = elem;
  //删除老参数，添加新参数
  var ok = Object.keys(ovd.$props);
  var nk = Object.keys(nvd.$props);
  //记录对比过的prop
  var hash = {};
  ok.forEach(function(prop) {
    //onXXX事件由__listener中的引用移除
    if(!/^on[A-Z]/.test(prop)) {
      hash[prop] = true;
      //对比老属性，相同无需更新
      var v = ovd.$props[prop];
      var n = nvd.$props[prop];
      if(v !== n) {
        ovd.__updateAttr(prop, n);
      }
    }
  });
  //移除__listener记录的引用
  ovd.__removeListener();
  //添加新vd的属性
  nk.forEach(function(prop) {
    if(/^on[A-Z]/.test(prop)) {
      var $name = prop.slice(2).replace(/[A-Z]/g, function(up) {
        return up.toLowerCase();
      });
      nvd.__addListener($name, function(event) {
        var item = nvd.$props[prop];
        if(item instanceof Cb) {
          item.cb.call(item.context, event);
        }
        else {
          item(event);
        }
      });
    }
    else if(!hash.hasOwnProperty(prop)) {
      nvd.__updateAttr(prop, nvd.$props[prop]);
    }
  });
  var ol = ovd.$children.length;
  var nl = nvd.$children.length;
  //渲染children
  var ranges = [];
  var option = { start: 0, record: [], first: true };
  var history;
  //遍历孩子，长度取新老vd最小值
  for(var i = 0, len = Math.min(ol, nl); i < len; i++) {
    var oc = ovd.$children[i];
    var nc = nvd.$children[i];
    //history记录着当前child索引，可能它是个数组，递归记录
    history = [i];
    //vd的child可能是vd、文本、变量和数组，但已不可能是Obj
    diffChild(elem, oc, nc, ranges, option, history);
  }
  var temp = {};
  //老的多余的删除
  if(i < ol) {
    for(;i < ol; i++) {
      del(elem, ovd.$children[i], ranges, option, temp, i == ol - 1);
    }
  }
  //新的多余的插入
  else if(i < nl) {
    for(;i < nl; i++) {
      history[history.length - 1] = i;
      add(elem, nvd.$children[i], ranges, option, history, temp, i == nl - 1);
    }
  }
  if(ranges.length) {
    //textarea特殊判断
    if(nvd.$name == 'textarea') {
      nvd.__updateAttr('value', range.value(ranges[0], nvd.$children));
      return;
    }
    ranges.forEach(function(item) {
      range.update(item, nvd.$children, elem);
    });
  }
  //缓存对象池
  cachePool.add(ovd.__destroy());
}

exports.diff=diff;function diff(elem, ov, nv, ranges, option, history) {
  //fix循环依赖
  if(Component.hasOwnProperty('default')) {
    Component = Component['default'];
  }
  //hack之前的状态，非Obj其实没有发生变更，假设自己变自己的状态
  if(!option.first) {
    if(option.prev == type.TEXT) {
      option.state = TEXT_TO_TEXT;
    }
    else {
      option.state = DOM_TO_DOM;
    }
  }
  diffChild(elem, ov, nv, ranges, option, history, true);
  //当最后一次对比是类型变换时记录，因为随后的text可能要更新
  if(!option.t2d && !option.d2t) {
    if(option.state == TEXT_TO_DOM) {
      option.t2d = true;
    }
    else if(option.state == DOM_TO_TEXT) {
      option.d2t = true;
    }
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
        var temp = {};
        for(var i = 1; i < ol; i++) {
          del(elem, ovd[i], ranges, option, temp, i == ol - 1);
        }
        break;
      //空数组变为有内容
      case 2:
        diffChild(elem, ovd[0], nvd[0], ranges, option, history);
        var temp = {};
        for(var i = 1; i < nl; i++) {
          history[history.length - 1] = i;
          add(elem, nvd[i], ranges, option, history, temp, i == nl - 1);
        }
        break;
      //都有内容
      case 3:
        for(var i = 0, len = Math.min(ol, nl); i < len; i++) {
          history[history.length - 1] = i;
          diffChild(elem, ovd[i], nvd[i], ranges, option, history);
        }
        var temp = {};
        //老的多余的删除
        if(i < ol) {
          for(;i < ol; i++) {
            del(elem, ovd[i], ranges, option, temp, i == ol - 1);
          }
        }
        //新的多余的插入
        else if(i < nl) {
          for(;i < nl; i++) {
            history[history.length - 1] = i;
            add(elem, nvd[i], ranges, option, history, temp, i == nl - 1);
          }
        }
        break;
    }
    history.pop();
  }
  //老的是数组新的不是
  else if(oa) {
    //将老的第1个和新的相比，注意老的第一个可能还是个数组，递归下去
    diffChild(elem, ovd[0], nvd, ranges, option, history);
    //移除剩余的老的
    var temp = {};
    for(var i = 1, len = ovd.length; i < len; i++) {
      del(elem, ovd[i], ranges, option, temp, i == len - 1);
    }
  }
  //新的是数组老的不是
  else if(na) {
    history.push(0);
    //将新的第1个和老的相比，注意新的第一个可能还是个数组，递归下去
    diffChild(elem, ovd, nvd[0], ranges, option, history);
    var temp = {};
    //增加剩余的新的
    for(var i = 1, len = nvd.length; i < len; i++) {
      history[history.length - 1] = i;
      add(elem, nvd[i], ranges, option, history, temp, i == len - 1);
    }
    history.pop();
  }
  //都不是数组
  else {
    var oe = ovd instanceof Element && !(ovd instanceof migi.NonVisualComponent) ? 1 : 0;
    var ne = nvd instanceof Element && !(nvd instanceof migi.NonVisualComponent) ? 2 : 0;
    //新老值是否为DOM或TEXT分4种情况
    switch(oe + ne) {
      //都是text时，根据上个节点类型和history设置range
      case 0:
        if(!option.first) {
          check(option, elem, nvd, ranges, history);
        }
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
              addRange(ranges, option);
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
            case DOM_TO_TEXT:
              addRange(ranges, option);
              elem.removeChild(cns[option.start + 1]);
              break;
            case TEXT_TO_DOM:
              addRange(ranges, option);
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
        //缓存对象池
        cachePool.add(ovd.__destroy());
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
        if(!option.first) {
          switch(option.state) {
            case DOM_TO_TEXT:
            case TEXT_TO_TEXT:
              option.start++;
              break;
          }
          delete option.t2d;
          delete option.d2t;
        }
        var ocp = ovd instanceof Component ? 1 : 0;
        var ncp = nvd instanceof Component ? 2 : 0;
        switch(ocp + ncp) {
          //DOM名没变递归diff，否则重绘
          case 0:
            if(ovd.$name == nvd.$name) {
              diffVd(ovd, nvd);
            }
            else {
              elem.insertAdjacentHTML('afterend', nvd.toString());
              elem.parentNode.removeChild(elem);
            }
            break;
          //Component和VirtualDom变化则直接重绘
          case 1:
            diffVd(ovd.$virtualDom, nvd);
            break;
          case 2:
            diffVd(ovd, nvd.$virtualDom);
            break;
          //Component的class类型没变则diff，否则重绘
          case 3:
            if(ovd.constructor == nvd.constructor) {
              nvd.toString();
              diffVd(ovd.$virtualDom, nvd.$virtualDom);
            }
            else {
              elem.innerHTML = nvd.toString();
            }
            break;
        }
        option.state = DOM_TO_DOM;
        option.prev = type.DOM;
        option.start++;
        //缓存对象池
        cachePool.add(ovd.__destroy());
        break;
    }
    //非可视组件被当作空字符串处理，连同其他组件，不要忘了DOM事件
    if(nvd instanceof Component) {
      nvd.emit(Event.DOM);
    }
  }
  option.first = false;
}

exports.check=check;function check(option, elem, vd, ranges, history) {
  if(option.t2d) {
    delete option.t2d;
    range.record(history, option);
    insertAt(elem, elem.childNodes, option.start, vd, true);
  }
  else if(option.d2t) {
    delete option.d2t;
    addRange(ranges, option);
    removeAt(elem, option.start + 1);
  }
}});