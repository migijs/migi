define(function(require, exports, module){var Element=function(){var _0=require('./Element');return _0.hasOwnProperty("default")?_0["default"]:_0}();
var VirtualDom=function(){var _1=require('./VirtualDom');return _1.hasOwnProperty("default")?_1["default"]:_1}();
var Obj=function(){var _2=require('./Obj');return _2.hasOwnProperty("default")?_2["default"]:_2}();
var util=function(){var _3=require('./util');return _3.hasOwnProperty("default")?_3["default"]:_3}();
var type=function(){var _4=require('./type');return _4.hasOwnProperty("default")?_4["default"]:_4}();

function join(index, children, history) {
  var res = '';
  for(var i = index.shift(), len = children.length; i < len; i++) {
    var child = children[i];
    if(index.length) {
      if(child instanceof Obj) {
        res += join(index, child.v, history);
      }
      else {
        res += join(index, child, history);
      }
      if(history.end) {
        break;
      }
    }
    else if(child instanceof Obj) {
      if(Array.isArray(child.v)) {
        res += joinObj(child.v, history);
        if(history.end) {
          break;
        }
      }
      else if(child.v instanceof Element) {
        history.end = true;
        break;
      }
      else {
        res += child.toString();
      }
    }
    else if(child instanceof Element) {
      history.end = true;
      break;
    }
    //array逻辑和Obj里面相同
    else if(Array.isArray(child)) {
      res += joinObj(child, history);
      if(history.end) {
        break;
      }
    }
    else {
      res += child === void 0 || child === null ? '' : child.toString();
    }
  }
  return res;
}
//递归找到第一个不是text的为止，将之前的text拼接返回
function joinObj(arr, history) {
  var res = '';
  for(var i = 0, len = arr.length; i < len; i++) {
    var child = arr[i];
    if(history.end) {
      break;
    }
    if(Array.isArray(child)) {
      res += joinObj(child, history);
    }
    else if(child instanceof Element) {
      history.end = true;
      break;
    }
    else {
      res += child === void 0 || child === null ? '' : child.toString();
    }
  }
  return res;
}

exports.update=update;function update(item, children, elem) {
  //fix循环依赖
  if(VirtualDom.hasOwnProperty('default')) {
    VirtualDom = VirtualDom['default'];
  }
  //从item的index开始往后找，直到不是text为止，拼接所有text进行更新
  var res = join(item.index, children, {});
  var cns = elem.childNodes;
  var textNode = cns[item.start];
  //神奇的地方，更新的对象是个DOM而不是TEXT，会发生在混杂情况下的t2d变化
  //如t1{t}t2{t}变为t1{d}t2{d}，t2记录的range的start在3，而其目前是第2个{d}的DOM，插入在t2d逻辑中
  if(textNode.nodeType == 1) {
    return;
  }
  var now = util.lie ? textNode.innerText : textNode.textContent;
  if(res != now) {
    //textContent自动转义，保留空白
    //ie的innerText会解释html标签，故用临时节点的innerHTML再replace代替
    //有实体字符时也不能用textContent
    //但当为innerHTML空时，没有孩子节点，所以特殊判断
    if(res) {
      if(util.lie || /&([a-z]+|#\d+);/i.test(res)) {
        var node = util.NODE;
        node.innerHTML = util.encodeHtml(res);
        elem.replaceChild(node.firstChild, textNode);
      }
      else {
        textNode.textContent = res;
      }
    }
    else if(util.lie) {
      textNode.innerText = '';
    }
    else {
      textNode.textContent = '';
    }
  }
}

exports.value=value;function value(item, children) {
  //fix循环依赖
  if(VirtualDom.hasOwnProperty('default')) {
    VirtualDom = VirtualDom['default'];
  }
  //从item的index开始往后找，直到不是text为止，拼接所有text进行更新
  return join(item.index, children, {});
}

exports.record=record;function record(history, option) {
  if(option.first || option.prev == type.DOM) {
    option.record = history.slice();
  }
}});