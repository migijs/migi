define(function(require, exports, module){'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Element = require('./Element');

var _Element2 = _interopRequireDefault(_Element);

var _VirtualDom = require('./VirtualDom');

var _VirtualDom2 = _interopRequireDefault(_VirtualDom);

var _Obj = require('./Obj');

var _Obj2 = _interopRequireDefault(_Obj);

var _util = require('./util');

var _util2 = _interopRequireDefault(_util);

var _browser = require('./browser');

var _browser2 = _interopRequireDefault(_browser);

var _type = require('./type');

var _type2 = _interopRequireDefault(_type);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function join(index, children, history) {
  var res = '';
  for (var i = index.shift(), len = children.length; i < len; i++) {
    var child = children[i];
    if (index.length) {
      if (child instanceof _Obj2.default) {
        res += join(index, child.v, history);
      } else {
        res += join(index, child, history);
      }
      if (history.end) {
        break;
      }
    } else if (child instanceof _Obj2.default) {
      if (Array.isArray(child.v)) {
        res += joinObj(child.v, history);
        if (history.end) {
          break;
        }
      } else if (child.v instanceof _Element2.default) {
        history.end = true;
        break;
      } else {
        res += child.toSourceString();
      }
    } else if (child instanceof _Element2.default) {
      history.end = true;
      break;
    }
    // array逻辑和Obj里面相同
    else if (Array.isArray(child)) {
        res += joinObj(child, history);
        if (history.end) {
          break;
        }
      } else {
        res += _util2.default.stringify(child);
      }
  }
  return res;
}
// 递归找到第一个不是text的为止，将之前的text拼接返回
function joinObj(arr, history) {
  var res = '';
  for (var i = 0, len = arr.length; i < len; i++) {
    var child = arr[i];
    if (history.end) {
      break;
    }
    if (Array.isArray(child)) {
      res += joinObj(child, history);
    } else if (child instanceof _Element2.default) {
      history.end = true;
      break;
    } else {
      res += _util2.default.stringify(child);
    }
  }
  return res;
}

function update(item, children, elem) {
  // 从item的index开始往后找，直到不是text为止，拼接所有text进行更新
  var res = join(item.index, children, {});
  var cns = elem.childNodes;
  var textNode = cns[item.start];
  // 神奇的地方，更新的对象是个DOM而不是TEXT，会发生在混杂情况下的t2d变化
  // 如t1{t}t2{t}变为t1{d}t2{d}，t2记录的range的start在3，而其目前是第2个{d}的DOM，插入在t2d逻辑中
  if (textNode.nodeType == 1) {
    return;
  }
  var now = textNode.textContent;
  if (res != now) {
    // textContent自动转义，保留空白
    textNode.textContent = res || '';
  }
}

function value(item, children) {
  // 从item的index开始往后找，直到不是text为止，拼接所有text进行更新
  return join(item.index, children, {});
}

exports.default = {
  update: update,
  value: value
};});