define(function(require, exports, module){'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Event = require('./Event');

var _Event2 = _interopRequireDefault(_Event);

var _Component = require('./Component');

var _Component2 = _interopRequireDefault(_Component);

var _Cb = require('./Cb');

var _Cb2 = _interopRequireDefault(_Cb);

var _util = require('./util');

var _util2 = _interopRequireDefault(_util);

var _browser = require('./browser');

var _browser2 = _interopRequireDefault(_browser);

var _range = require('./range');

var _range2 = _interopRequireDefault(_range);

var _cachePool = require('./cachePool');

var _cachePool2 = _interopRequireDefault(_cachePool);

var _type = require('./type');

var _type2 = _interopRequireDefault(_type);

var _hash = require('./hash');

var _hash2 = _interopRequireDefault(_hash);

var _matchHash = require('./matchHash');

var _matchHash2 = _interopRequireDefault(_matchHash);

var _fixEvent = require('./fixEvent');

var _fixEvent2 = _interopRequireDefault(_fixEvent);

var _delegate = require('./delegate');

var _delegate2 = _interopRequireDefault(_delegate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function replaceWith(elem, cns, index, vd, isText) {
  // insertAdjacentHTML在插入text时浏览器行为表现不一致，ff会合并相邻text，chrome则不会
  // 因此DOM使用insertAdjacentHTML，text则用textNode
  var target;
  if (isText) {
    var s = _util2.default.stringify(vd);
    target = document.createTextNode(s || '');
    elem.replaceChild(target, cns[index]);
  } else {
    target = vd.toString();
    // textNode没有insertAdjacentHTML方法，必须使用replaceChild
    if (cns[index].nodeType == 1) {
      cns[index].insertAdjacentHTML('afterend', target);
      elem.removeChild(cns[index]);
    } else {
      var node = _browser2.default.getParent(vd.__name);
      node.innerHTML = target;
      elem.replaceChild(node.firstChild, cns[index]);
    }
    // 别忘了触发DOM事件
    vd.emit(_Event2.default.DOM);
  }
}
function insertAt(elem, cns, index, vd, isText) {
  var target;
  if (isText) {
    var s = _util2.default.stringify(vd);
    target = document.createTextNode(s || '');
    if (index >= cns.length) {
      elem.appendChild(target);
    } else {
      elem.insertBefore(target, cns[index]);
    }
  } else {
    target = vd.toString();
    if (index >= cns.length) {
      elem.insertAdjacentHTML('beforeend', target);
    } else {
      if (cns[index].nodeType == 1) {
        cns[index].insertAdjacentHTML('beforebegin', target);
      } else {
        var node = _browser2.default.getParent(vd.name);
        node.innerHTML = target;
        elem.insertBefore(node.firstChild, cns[index]);
      }
    }
    // 别忘了触发DOM事件
    vd.emit(_Event2.default.DOM);
  }
}

function add(parent, elem, vd, record, temp, last) {
  if (Array.isArray(vd)) {
    record.index.push(0);
    // 防止空数组跳过的情况
    for (var i = 0, len = Math.max(vd.length, 1); i < len; i++) {
      var item = vd[i];
      record.index[record.index.length - 1] = i;
      add(parent, elem, item, record, temp, last && i == len - 1);
    }
    record.index.pop();
  } else if (_util2.default.isDom(vd)) {
    vd.__parent = parent;
    vd.__top = parent.top;
    vd.style = parent.style;
    _hash2.default.set(vd);
    if (temp.prev) {
      if (temp.prev == _type2.default.TEXT) {
        record.start++;
      }
      insertAt(elem, elem.childNodes, record.start++, vd);
    } else {
      switch (record.state) {
        case _type2.default.DOM_TO_TEXT:
        case _type2.default.TEXT_TO_TEXT:
          // 第一次添加dom时，即使之前的text没有变化，也需记录range，但可能影响之后的t2t，也需记录
          addRange(record);
          record.start++;
          break;
        case _type2.default.TEXT_TO_DOM:
          break;
        case _type2.default.DOM_TO_DOM:
          break;
      }
      insertAt(elem, elem.childNodes, record.start++, vd);
    }
    temp.prev = _type2.default.DOM;
  } else {
    if (temp.prev) {
      if (temp.prev == _type2.default.DOM) {
        insertAt(elem, elem.childNodes, record.start, vd, true);
        recordRange(record);
      }
      addRange(record);
    } else {
      switch (record.state) {
        case _type2.default.DOM_TO_TEXT:
        case _type2.default.TEXT_TO_TEXT:
          addRange(record);
          break;
        case _type2.default.TEXT_TO_DOM:
          insertAt(elem, elem.childNodes, record.start, vd, true);
          recordRange(record);
          addRange(record);
          break;
        case _type2.default.DOM_TO_DOM:
          insertAt(elem, elem.childNodes, record.start, vd, true);
          recordRange(record);
          break;
      }
    }
    temp.prev = _type2.default.TEXT;
  }
  // add结束后，根据之前的state和最后add的d/t假设出当前等同的状态
  if (last) {
    switch (record.state) {
      case _type2.default.TEXT_TO_TEXT:
        if (temp.prev == _type2.default.DOM) {
          record.state = _type2.default.TEXT_TO_DOM;
        }
        break;
      case _type2.default.DOM_TO_DOM:
        if (temp.prev == _type2.default.TEXT) {
          record.state = _type2.default.DOM_TO_TEXT;
        }
        break;
      case _type2.default.TEXT_TO_DOM:
        if (temp.prev == _type2.default.TEXT) {
          record.state = _type2.default.TEXT_TO_TEXT;
        }
        break;
      case _type2.default.DOM_TO_TEXT:
        if (temp.prev == _type2.default.DOM) {
          record.state = _type2.default.DOM_TO_DOM;
        }
        break;
    }
    record.prev = temp.prev;
  }
}

function del(elem, vd, record, temp, last) {
  if (Array.isArray(vd)) {
    for (var i = 0, len = vd.length; i < len; i++) {
      del(elem, vd[i], record, temp, last && i == len - 1);
    }
  } else if (_util2.default.isDom(vd)) {
    switch (record.state) {
      case _type2.default.DOM_TO_TEXT:
      case _type2.default.TEXT_TO_TEXT:
        removeAt(elem, record.start + 1);
        break;
      case _type2.default.TEXT_TO_DOM:
      case _type2.default.DOM_TO_DOM:
        removeAt(elem, record.start);
        break;
    }
    temp.prev = _type2.default.DOM;
    // 缓存对象池
    _cachePool2.default.add(vd.__destroy());
  } else {
    if (temp.prev) {
      if (temp.prev == _type2.default.DOM) {
        switch (record.state) {
          case _type2.default.DOM_TO_TEXT:
            removeAt(elem, record.start + 1);
            addRange(record);
            break;
          case _type2.default.TEXT_TO_TEXT:
            removeAt(elem, record.start + 1);
            addRange(record);
            break;
          case _type2.default.DOM_TO_DOM:
            removeAt(elem, record.start);
            break;
          case _type2.default.TEXT_TO_DOM:
            removeAt(elem, record.start);
            break;
        }
      }
      // 删过text，之后的text自动一并删除，可以忽略
      // else {}
    } else {
      switch (record.state) {
        case _type2.default.DOM_TO_TEXT:
          removeAt(elem, record.start + 1);
          addRange(record);
          break;
        case _type2.default.TEXT_TO_TEXT:
          addRange(record);
          break;
        case _type2.default.DOM_TO_DOM:
          removeAt(elem, record.start);
          break;
        case _type2.default.TEXT_TO_DOM:
          break;
      }
    }
    temp.prev = _type2.default.TEXT;
  }
  if (last) {
    switch (record.state) {
      case _type2.default.TEXT_TO_TEXT:
        if (temp.prev == _type2.default.DOM) {
          record.state = _type2.default.DOM_TO_TEXT;
        } else {
          addRange(record);
        }
        break;
      case _type2.default.DOM_TO_DOM:
        if (temp.prev == _type2.default.TEXT) {
          record.state = _type2.default.TEXT_TO_DOM;
        }
        break;
      case _type2.default.TEXT_TO_DOM:
        if (temp.prev == _type2.default.DOM) {
          record.state = _type2.default.DOM_TO_DOM;
        }
        break;
      case _type2.default.DOM_TO_TEXT:
        if (temp.prev == _type2.default.TEXT) {
          record.state = _type2.default.TEXT_TO_TEXT;
        }
        break;
    }
  }
}
function removeAt(elem, start) {
  // 当table省略tbody直接写tr时，浏览器可能会自动生成tbody节点，diff时不在对比内会造成bug，提前判断下
  if (elem.childNodes[start]) {
    elem.removeChild(elem.childNodes[start]);
  }
}

function equalText(a, b) {
  if (a === void 0 || a === null) {
    a = '';
  }
  if (b === void 0 || b === null) {
    b = '';
  }
  return a.toString() == b.toString();
}

function recordRange(record) {
  record.history = record.index.slice();
}

function addRange(record) {
  var start = record.start;
  // 连续text更新防止重复，它们的dom索引start相同
  if (record.range.length && record.range[record.range.length - 1].start == start) {
    return;
  }
  record.range.push({
    start: start,
    index: record.history.slice()
  });
}

function diffVd(ovd, nvd) {
  // 相同引用说明没发生变更，在一些使用常量、变量未变的情况下会如此
  if (ovd == nvd) {
    return;
  }
  // 特殊的uid，以及一些引用赋给新vd
  var elem = ovd.element;
  var props = ['__uid', '__element', '__parent', '__top', '__style', '__dom', '__names'];
  var i = props.length - 1;
  for (; i >= 0; i--) {
    var k = props[i];
    nvd[k] = ovd[k];
  }
  // vd记录更新uid引用
  _hash2.default.set(nvd);
  // 记录对比过的prop
  var temp = {};
  for (i = ovd.__props.length - 1; i >= 0; i--) {
    var item = ovd.__props[i];
    var k = item[0];
    var v = item[1];
    // 只检查普通属性，onXXX事件由__listener中的引用移除
    if (k.indexOf('on') != 0 || k == 'on') {
      temp[k] = true;
      // 对比老属性，多余删除，相同无需更新
      if (nvd.props.hasOwnProperty(k)) {
        var nv = nvd.props[k];
        if (nv !== v) {
          nvd.__updateAttr(k, nv);
        }
        nvd.__cache[k] = nv;
      } else {
        nvd.__updateAttr(k, null);
        delete nvd.__cache[k];
      }
    }
  }
  // 移除__listener记录的引用
  ovd.__removeListener();
  // 添加新vd的属性
  var len = nvd.__props.length;

  var _loop = function _loop() {
    item = nvd.__props[i];
    k = item[0];

    var v = item[1];
    // 事件和属性区分对待
    if (k.indexOf('on') == 0 && k != 'on') {
      name = k.slice(2).toLowerCase();

      nvd.__addListener(name, function (e) {
        e = e || window.event;
        (0, _fixEvent2.default)(e);
        var target = e.target;
        var uid = target.getAttribute('migi-uid');
        var tvd = _hash2.default.get(uid);
        if (v instanceof _Cb2.default) {
          v.cb.call(v.context, e, nvd, tvd);
        } else if (_util2.default.isFunction(v)) {
          v(e, nvd, tvd);
        } else if (Array.isArray(v)) {
          v.forEach(function (item) {
            var cb = item[1];
            if ((0, _delegate2.default)(e, item[0], nvd)) {
              if (cb instanceof _Cb2.default) {
                cb.cb.call(cb.context, e, nvd, tvd);
              } else if (_util2.default.isFunction(cb)) {
                cb(e, nvd, tvd);
              }
            }
          });
        }
      });
    } else if (!temp.hasOwnProperty(k)) {
      nvd.__updateAttr(k, v);
    }
  };

  for (i = 0; i < len; i++) {
    var item;
    var k;
    var name;

    _loop();
  }
  if (nvd.__style) {
    nvd.__updateStyle(true);
  }
  var record = { start: 0, index: [], range: [], first: true };
  diffChild(nvd, elem, ovd.children, nvd.children, record);
  if (record.range.length) {
    // textarea特殊判断
    if (nvd.__name == 'textarea') {
      nvd.__updateAttr('value', _range2.default.value(record.range[0], nvd.children));
      return;
    }
    for (var i = 0, len = record.range.length; i < len; i++) {
      _range2.default.update(record.range[i], nvd.children, elem);
    }
  }
  // 缓存对象池
  _cachePool2.default.add(ovd.__destroy());
}

function diff(parent, elem, ov, nv, record, opt) {
  if (opt) {
    diffArray(parent, elem, ov, nv, record, opt);
  } else {
    diffChild(parent, elem, ov, nv, record);
  }
}

function diffChild(parent, elem, ovd, nvd, record) {
  // 新老值是否是数组处理方式不同
  var oa = Array.isArray(ovd);
  var na = Array.isArray(nvd);
  // 都是数组时，还要检查二者长度
  if (oa && na) {
    var ol = ovd.length;
    var nl = nvd.length;
    var os = ol ? 1 : 0;
    var ns = nl ? 2 : 0;
    record.index.push(0);
    switch (os | ns) {
      // 都是空数组
      case 0:
        if (record.state == _type2.default.TEXT_TO_DOM) {
          insertAt(elem, elem.childNodes, record.start++, nvd, true);
        }
        record.state = _type2.default.TEXT_TO_TEXT;
        record.prev = _type2.default.TEXT;
        break;
      // 有内容的数组变为空数组
      case 1:
        diffChild(parent, elem, ovd[0], nvd[0], record);
        var temp = {};
        for (var i = 1; i < ol; i++) {
          del(elem, ovd[i], record, temp, i == ol - 1);
        }
        break;
      // 空数组变为有内容
      case 2:
        diffChild(parent, elem, ovd[0], nvd[0], record);
        var temp = {};
        for (var i = 1; i < nl; i++) {
          record.index[record.index.length - 1] = i;
          add(parent, elem, nvd[i], record, temp, i == nl - 1);
        }
        break;
      // 都有内容
      case 3:
        for (var i = 0, len = Math.min(ol, nl); i < len; i++) {
          record.index[record.index.length - 1] = i;
          diffChild(parent, elem, ovd[i], nvd[i], record);
        }
        var temp = {};
        // 老的多余的删除
        if (i < ol) {
          for (; i < ol; i++) {
            del(elem, ovd[i], record, temp, i == ol - 1);
          }
        }
        // 新的多余的插入
        else if (i < nl) {
            for (; i < nl; i++) {
              record.index[record.index.length - 1] = i;
              add(parent, elem, nvd[i], record, temp, i == nl - 1);
            }
          }
        break;
    }
    record.index.pop();
  }
  // 老的是数组新的不是
  else if (oa) {
      // 将老的第1个和新的相比，注意老的第一个可能还是个数组，递归下去
      diffChild(parent, elem, ovd[0], nvd, record);
      // 移除剩余的老的
      var temp = {};
      for (var i = 1, len = ovd.length; i < len; i++) {
        del(elem, ovd[i], record, temp, i == len - 1);
      }
    }
    // 新的是数组老的不是
    else if (na) {
        record.index.push(0);
        // 将新的第1个和老的相比，注意新的第一个可能还是个数组，递归下去
        diffChild(parent, elem, ovd, nvd[0], record);
        var temp = {};
        // 增加剩余的新的
        for (var i = 1, len = nvd.length; i < len; i++) {
          record.index[record.index.length - 1] = i;
          add(parent, elem, nvd[i], record, temp, i == len - 1);
        }
        record.index.pop();
      }
      // 都不是数组
      else {
          var oe = _util2.default.isDom(ovd) ? 1 : 0;
          var ne = _util2.default.isDom(nvd) ? 2 : 0;
          var cns = elem.childNodes;
          switch (oe | ne) {
            // 都是text时，根据上个状态设置range
            case 0:
              if (record.first) {
                // 先尝试记录range，连续的text会去重，始终以第一个text为准，后续的防重不会被记录
                // 记录后只有text发生改变时才会将这条记录状态改变
                recordRange(record);
                if (!equalText(ovd, nvd)) {
                  addRange(record);
                }
              } else {
                switch (record.state) {
                  case _type2.default.DOM_TO_TEXT:
                    elem.removeChild(cns[record.start + 1]);
                    // 因之前发生的d2t变更，本次t2t无需对比直接记录
                    addRange(record);
                    break;
                  case _type2.default.TEXT_TO_DOM:
                    insertAt(elem, cns, record.start, nvd, true);
                    recordRange(record);
                    // 因之前发生t2d变更，即便本次没有发生变化，但可能影响之后的t2t，也需记录
                    addRange(record);
                    break;
                  case _type2.default.DOM_TO_DOM:
                    recordRange(record);
                  case _type2.default.TEXT_TO_TEXT:
                    if (!equalText(ovd, nvd)) {
                      addRange(record);
                    }
                    break;
                }
              }
              record.state = _type2.default.TEXT_TO_TEXT;
              record.prev = _type2.default.TEXT;
              break;
            // DOM变TEXT
            case 1:
              ovd.__delRef();
              if (record.first) {
                replaceWith(elem, cns, record.start, nvd, true);
                recordRange(record);
              } else {
                switch (record.state) {
                  case _type2.default.DOM_TO_TEXT:
                  case _type2.default.TEXT_TO_TEXT:
                    addRange(record);
                    elem.removeChild(cns[record.start + 1]);
                    break;
                  case _type2.default.TEXT_TO_DOM:
                  case _type2.default.DOM_TO_DOM:
                    replaceWith(elem, cns, record.start, nvd, true);
                    recordRange(record);
                    break;
                }
              }
              // 缓存对象池
              _cachePool2.default.add(ovd.__destroy());
              record.state = _type2.default.DOM_TO_TEXT;
              record.prev = _type2.default.TEXT;
              break;
            // TEXT变DOM
            case 2:
              // 这种情况下相当于add新vd，无parent和style引用
              nvd.__parent = parent;
              nvd.__top = parent.top;
              nvd.style = parent.style;
              _hash2.default.set(nvd);
              if (record.first) {
                replaceWith(elem, cns, record.start++, nvd);
              } else {
                switch (record.state) {
                  case _type2.default.DOM_TO_TEXT:
                    record.start++;
                  case _type2.default.DOM_TO_DOM:
                    replaceWith(elem, cns, record.start++, nvd);
                    break;
                  case _type2.default.TEXT_TO_DOM:
                    insertAt(elem, cns, record.start++, nvd);
                    break;
                  case _type2.default.TEXT_TO_TEXT:
                    addRange(record);
                    insertAt(elem, cns, ++record.start, nvd);
                    record.start++;
                    break;
                }
              }
              record.state = _type2.default.TEXT_TO_DOM;
              record.prev = _type2.default.DOM;
              break;
            // DOM变DOM
            case 3:
              switch (record.state) {
                case _type2.default.DOM_TO_TEXT:
                case _type2.default.TEXT_TO_TEXT:
                  record.start++;
                  break;
              }
              var ocp = ovd instanceof _Component2.default ? 1 : 0;
              var ncp = nvd instanceof _Component2.default ? 2 : 0;
              switch (ocp | ncp) {
                // DOM名没变递归diff，否则重绘
                case 0:
                  ovd.__delRef();
                  if (ovd.__name == nvd.__name) {
                    ovd.__parent = parent;
                    ovd.__top = parent.top;
                    diffVd(ovd, nvd);
                    nvd.__saveRef();
                  } else {
                    nvd.__parent = parent;
                    nvd.__top = parent.top;
                    nvd.style = parent.style;
                    elem = ovd.element;
                    elem.insertAdjacentHTML('afterend', nvd.toString());
                    elem.parentNode.removeChild(elem);
                    nvd.emit(_Event2.default.DOM);
                    _matchHash2.default.del(ovd.__uid);
                    _hash2.default.set(nvd);
                    // 缓存对象池
                    _cachePool2.default.add(ovd.__destroy());
                  }
                  break;
                // Component和VirtualDom变化则直接重绘
                default:
                  ovd.__delRef();
                  elem = ovd.element;
                  elem.insertAdjacentHTML('afterend', nvd.toString());
                  elem.parentNode.removeChild(elem);
                  nvd.__parent = parent;
                  nvd.__top = parent.top;
                  // match中为模拟style的:active伪类注册了window的一些事件，需检查移除
                  if (ocp) {
                    _matchHash2.default.del(ovd.virtualDom.__uid);
                  } else {
                    _matchHash2.default.del(ovd.__uid);
                  }
                  nvd.style = parent.style;
                  nvd.emit(_Event2.default.DOM);
                  _hash2.default.set(nvd);
                  // 缓存对象池
                  _cachePool2.default.add(ovd.__destroy());
                  break;
              }
              record.state = _type2.default.DOM_TO_DOM;
              record.prev = _type2.default.DOM;
              record.start++;
              break;
          }
        }
  record.first = false;
}

function checkText(elem, vd, record) {
  if (record.state == _type2.default.TEXT_TO_DOM) {
    insertAt(elem, elem.childNodes, record.start, vd, true);
    recordRange(record);
    addRange(record);
  } else if (record.state == _type2.default.DOM_TO_TEXT) {
    addRange(record);
    removeAt(elem, record.start + 1);
  }
}

function diffArray(parent, elem, ovd, nvd, record, opt) {
  var ol = ovd.length;
  var nl = nvd.length;
  var os = ol ? 1 : 0;
  var ns = nl ? 2 : 0;
  record.index.push(0);
  switch (os | ns) {
    // 都是空数组
    case 0:
      if (record.state == _type2.default.TEXT_TO_DOM) {
        insertAt(elem, elem.childNodes, record.start++, nvd, true);
      }
      record.state = _type2.default.TEXT_TO_TEXT;
      record.prev = _type2.default.TEXT;
      break;
    // 有内容的数组变为空数组
    case 1:
      diffChild(parent, elem, ovd[0], nvd[0], record);
      var temp = {};
      for (var i = 1; i < ol; i++) {
        del(elem, ovd[i], record, temp, i == ol - 1);
      }
      break;
    // 空数组变为有内容
    case 2:
      diffChild(parent, elem, ovd[0], nvd[0], record);
      var temp = {};
      for (var i = 1; i < nl; i++) {
        record.index[record.index.length - 1] = i;
        add(parent, elem, nvd[i], record, temp, i == nl - 1);
      }
      break;
    // 都有内容
    case 3:
      var oFirst = _util2.default.arrFirst(ovd);
      var nFirst = _util2.default.arrFirst(nvd);
      var ot = _util2.default.isDom(oFirst) ? 1 : 0;
      var nt = _util2.default.isDom(nFirst) ? 2 : 0;
      var temp = {};
      switch (opt.method) {
        case 'push':
          if (!record.first && nt == 0) {
            record.index[record.index.length - 1] = 0;
            checkText(elem, nFirst, record);
          }
          for (var i = 0; i < ol; i++) {
            record.index[record.index.length - 1] = i;
            scan(elem, nvd[i], record);
          }
          // 可能push多个参数
          for (; i < nl; i++) {
            record.index[record.index.length - 1] = i;
            add(parent, elem, nvd[i], record, temp, i == nl - 1);
          }
          break;
        case 'pop':
          if (!record.first && nt == 0) {
            record.index[record.index.length - 1] = 0;
            checkText(elem, nFirst, record);
          }
          for (var i = 0; i < nl; i++) {
            record.index[record.index.length - 1] = i;
            scan(elem, nvd[i], record);
          }
          del(elem, ovd[nl], record, {}, true);
          break;
        case 'unshift':
          if (record.first) {
            record.state = _type2.default.DOM_TO_DOM;
          }
          for (var i = 0; i < nl - ol; i++) {
            record.index[record.index.length - 1] = i;
            add(parent, elem, nvd[i], record, temp, i == nl - ol - 1);
          }
          if (ot == 0) {
            record.index[record.index.length - 1] = i;
            checkText(elem, oFirst, record);
          }
          for (; i < nl; i++) {
            record.index[record.index.length - 1] = i;
            scan(elem, nvd[i], record);
          }
          break;
        case 'shift':
          if (record.first) {
            record.state = _type2.default.DOM_TO_DOM;
          }
          del(elem, ovd[0], record, {}, true);
          if (nt == 0) {
            record.index[record.index.length - 1] = 0;
            checkText(elem, nFirst, record);
          }
          for (var i = 0; i < nl; i++) {
            record.index[record.index.length - 1] = i;
            scan(elem, nvd[i], record);
          }
          break;
        case 'splice':
          var index = opt.args[0];
          var delLen = opt.args[1];
          var addLen = opt.args.length - 2;
          for (var i = 0; i < index; i++) {
            record.index[record.index.length - 1] = i;
            scan(elem, nvd[i], record);
          }
          if (record.first) {
            record.state = _type2.default.DOM_TO_DOM;
          }
          for (; i < Math.min(delLen, addLen) + index; i++) {
            record.index[record.index.length - 1] = i;
            diffChild(parent, elem, ovd[i], nvd[i], record);
          }
          if (delLen > addLen) {
            for (var j = i; j < delLen + index; j++) {
              del(elem, ovd[j], record, temp, j == delLen + index - 1);
            }
          } else if (delLen < addLen) {
            for (; i < addLen + index; i++) {
              record.index[record.index.length - 1] = i;
              add(parent, elem, nvd[i], record, temp, i == addLen + index - 1);
            }
          }
          if (i < nl) {
            nFirst = _util2.default.arrFirst(nvd[i]);
            if (!_util2.default.isDom(nFirst)) {
              record.index[record.index.length - 1] = i;
              checkText(elem, nFirst, record);
            }
          }
          for (; i < nl; i++) {
            record.index[record.index.length - 1] = i;
            scan(elem, nvd[i], record);
          }
          break;
      }
      break;
  }
  record.index.pop();
  record.first = false;
}

function scan(elem, vd, record) {
  if (Array.isArray(vd)) {
    record.index.push(0);
    for (var i = 0, len = vd.length; i < len; i++) {
      record.index[record.index.length - 1] = i;
      scan(elem, vd[i], record);
    }
    record.index.pop();
  } else {
    if (_util2.default.isDom(vd)) {
      if (record.prev == _type2.default.TEXT) {
        record.start++;
      }
      record.state = _type2.default.DOM_TO_DOM;
      record.prev = _type2.default.DOM;
      record.start++;
    } else {
      if (record.first || record.prev == _type2.default.DOM) {
        recordRange(record);
      }
      record.state = _type2.default.TEXT_TO_TEXT;
      record.prev = _type2.default.TEXT;
    }
    record.first = false;
  }
}

exports.default = {
  diff: diff,
  checkText: checkText,
  recordRange: recordRange,
  addRange: addRange
};});