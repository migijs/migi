import Event from './Event';
import Element from './Element';
import Component from './Component';
import Cb from './Cb';
import util from './util';
import browser from './browser';
import range from './range';
import cachePool from './cachePool';
import type from './type';
import hash from './hash';
import matchHash from './matchHash';
import fixEvent from './fixEvent';
import delegate from './delegate';

const DOM_TO_TEXT = 0;
const DOM_TO_DOM = 1;
const TEXT_TO_DOM = 2;
const TEXT_TO_TEXT = 3;

function replaceWith(elem, cns, index, vd, isText) {
  //insertAdjacentHTML在插入text时浏览器行为表现不一致，ff会合并相邻text，chrome则不会
  //因此DOM使用insertAdjacentHTML，text则用textNode
  var target;
  if(isText) {
    var s = util.stringify(vd);
    target = document.createTextNode(s || '');
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
        var node = browser.getParent(vd.name);
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
    var s = util.stringify(vd);
    target = document.createTextNode(s || '');
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
        var node = browser.getParent(vd.name);
        node.innerHTML = target;
        elem.insertBefore(node.firstChild, cns[index]);
      }
    }
    //别忘了触发DOM事件
    vd.emit(Event.DOM);
  }
}

function add(elem, vd, ranges, option, history, temp, last, parent) {
  if(Array.isArray(vd)) {
    history.push(0);
    //防止空数组跳过的情况
    for(var i = 0, len = Math.max(vd.length, 1); i < len; i++) {
      var item = vd[i];
      history[history.length - 1] = i;
      add(elem, item, ranges, option, history, temp, last && i == len - 1, parent);
    }
    history.pop();
  }
  else if(vd instanceof Element && !(vd instanceof migi.NonVisualComponent)) {
    vd.__parent = parent;
    vd.__top = parent.top;
    vd.style = parent.style;
    hash.set(vd);
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
    for(var i = 0, len = vd.length; i < len; i++) {
      del(elem, vd[i], ranges, option, temp, last && i == len - 1);
    }
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
  // 当table省略tbody直接写tr时，浏览器可能会自动生成tbody节点，diff时不在对比内会造成bug，提前判断下
  if(elem.childNodes[start]) {
    elem.removeChild(elem.childNodes[start]);
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
  var len = ranges.length;
  if(!len || ranges[len - 1].start < option.start) {
    ranges.push({ start: option.start, index: option.record.slice() });
  }
}

function diffVd(ovd, nvd) {
  //相同引用说明没发生变更，在一些使用常量、变量未变的情况下会如此
  if(ovd == nvd) {
    return;
  }
  //特殊的uid，以及一些引用赋给新vd
  var elem = ovd.element;
  var props = ['uid', '__element', '__parent', '__top', '__style', '__dom', '__names'];
  var i = props.length - 1;
  for(; i >= 0; i--) {
    var k = props[i];
    nvd[k] = ovd[k];
  }
  //vd记录更新uid引用
  hash.set(nvd);
  //记录对比过的prop
  var temp = {};
  for(i = ovd.__props.length - 1; i >= 0; i--) {
    var item = ovd.__props[i];
    var k = item[0];
    var v = item[1];
    //只检查普通属性，onXXX事件由__listener中的引用移除
    if(k.indexOf('on') != 0 || k == 'on') {
      temp[k] = true;
      //对比老属性，多余删除，相同无需更新
      if(nvd.props.hasOwnProperty(k)) {
        var nv = nvd.props[k];
        if(nv !== v) {
          nvd.__updateAttr(k, nv);
        }
        nvd.__cache[k] = nv;
      }
      else {
        nvd.__updateAttr(k, null);
        delete nvd.__cache[k];
      }
    }
  }
  //移除__listener记录的引用
  ovd.__removeListener();
  //添加新vd的属性
  var len = nvd.__props.length;
  for(i = 0; i < len; i++) {
    var item = nvd.__props[i];
    var k = item[0];
    let v = item[1];
    //事件和属性区分对待
    if(k.indexOf('on') == 0 && k != 'on') {
      var name = k.slice(2).toLowerCase();
      nvd.__addListener(name, function(e) {
        e = e || window.event;
        fixEvent(e);
        var target = e.target;
        var uid = target.getAttribute('migi-uid');
        var tvd = hash.get(uid);
        if(v instanceof Cb) {
          v.cb.call(v.context, e, nvd, tvd);
        }
        else if(util.isFunction(v)) {
          v(e, nvd, tvd);
        }
        else if(Array.isArray(v)) {
          v.forEach(function(item) {
            var cb = item[1];
            if(delegate(e, item[0], nvd)) {
              if(cb instanceof Cb) {
                cb.cb.call(cb.context, e, nvd, tvd);
              }
              else if(util.isFunction(cb)) {
                cb(e, nvd, tvd);
              }
            }
          });
        }
      });
    }
    else if(!temp.hasOwnProperty(k)) {
      nvd.__updateAttr(k, v);
    }
  }
  if(nvd.__style) {
    nvd.__updateStyle(true);
  }
  var ranges = [];
  diffChild(elem, ovd.children, nvd.children, ranges, { start: 0, record: [], first: true }, [], nvd);
  if(ranges.length) {
    //textarea特殊判断
    if(nvd.name == 'textarea') {
      nvd.__updateAttr('value', range.value(ranges[0], nvd.children));
      return;
    }
    for(i = ranges.length - 1; i >= 0; i--) {
      range.update(ranges[i], nvd.children, elem);
    }
  }
  //缓存对象池
  cachePool.add(ovd.__destroy());
}

function diff(elem, ov, nv, ranges, option, history, parent) {
  //hack之前的状态，非Obj其实没有发生变更，假设自己变自己的状态
  if(!option.first) {
    if(option.prev == type.TEXT) {
      option.state = TEXT_TO_TEXT;
    }
    else {
      option.state = DOM_TO_DOM;
    }
  }
  diffChild(elem, ov, nv, ranges, option, history, parent);
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

function diffChild(elem, ovd, nvd, ranges, option, history, parent) {
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
        diffChild(elem, ovd[0], nvd[0], ranges, option, history, parent);
        var temp = {};
        for(var i = 1; i < ol; i++) {
          del(elem, ovd[i], ranges, option, temp, i == ol - 1);
        }
        break;
      //空数组变为有内容
      case 2:
        diffChild(elem, ovd[0], nvd[0], ranges, option, history, parent);
        var temp = {};
        for(var i = 1; i < nl; i++) {
          history[history.length - 1] = i;
          add(elem, nvd[i], ranges, option, history, temp, i == nl - 1, parent);
        }
        break;
      //都有内容
      case 3:
        for(var i = 0, len = Math.min(ol, nl); i < len; i++) {
          history[history.length - 1] = i;
          diffChild(elem, ovd[i], nvd[i], ranges, option, history, parent);
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
            add(elem, nvd[i], ranges, option, history, temp, i == nl - 1, parent);
          }
        }
        break;
    }
    history.pop();
  }
  //老的是数组新的不是
  else if(oa) {
    //将老的第1个和新的相比，注意老的第一个可能还是个数组，递归下去
    diffChild(elem, ovd[0], nvd, ranges, option, history, parent);
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
    diffChild(elem, ovd, nvd[0], ranges, option, history, parent);
    var temp = {};
    //增加剩余的新的
    for(var i = 1, len = nvd.length; i < len; i++) {
      history[history.length - 1] = i;
      add(elem, nvd[i], ranges, option, history, temp, i == len - 1, parent);
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
        //这种情况下相当于add新vd，无parent和style引用
        nvd.__parent = parent;
        nvd.__top = parent.top;
        nvd.style = parent.style;
        hash.set(nvd);
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
            if(ovd.name == nvd.name) {
              ovd.__parent = parent;
              ovd.__top = parent.top;
              diffVd(ovd, nvd);
            }
            else {
              nvd.__parent = parent;
              nvd.__top = parent.top;
              nvd.style = parent.style;
              elem = ovd.element;
              elem.insertAdjacentHTML('afterend', nvd.toString());
              elem.parentNode.removeChild(elem);
              nvd.emit(Event.DOM);
              matchHash.del(ovd.uid);
              hash.set(nvd);
              //缓存对象池
              cachePool.add(ovd.__destroy());
            }
            break;
          //Component和VirtualDom变化则直接重绘
          default:
            elem = ovd.element;
            elem.insertAdjacentHTML('afterend', nvd.toString());
            elem.parentNode.removeChild(elem);
            nvd.__parent = parent;
            nvd.__top = parent.top;
            //match中为模拟style的:active伪类注册了window的一些事件，需检查移除
            if(ncp) {
              matchHash.del(ovd.virtualDom.uid);
            }
            else {
              matchHash.del(ovd.uid);
              nvd.style = parent.style;
            }
            nvd.emit(Event.DOM);
            hash.set(nvd);
            //缓存对象池
            cachePool.add(ovd.__destroy());
            break;
        }
        option.state = DOM_TO_DOM;
        option.prev = type.DOM;
        option.start++;
        break;
    }
    //非可视组件被当作空字符串处理，连同其他组件，不要忘了DOM事件
    if(nvd instanceof migi.NonVisualComponent) {
      nvd.emit(Event.DOM);
    }
  }
  option.first = false;
}

function check(option, elem, vd, ranges, history) {
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
}

export default {
  diff,
  check
};
