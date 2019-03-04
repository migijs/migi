import Element from './Element';
import VirtualDom from './VirtualDom';
import Obj from './Obj';
import util from './util';
import browser from './browser';
import type from './type';

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
        res += child.toSourceString();
      }
    }
    else if(child instanceof Element) {
      history.end = true;
      break;
    }
    // array逻辑和Obj里面相同
    else if(Array.isArray(child)) {
      res += joinObj(child, history);
      if(history.end) {
        break;
      }
    }
    else {
      res += util.stringify(child);
    }
  }
  return res;
}
// 递归找到第一个不是text的为止，将之前的text拼接返回
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
      res += util.stringify(child);
    }
  }
  return res;
}

function update(item, children, elem) {
  // 从item的index开始往后找，直到不是text为止，拼接所有text进行更新
  var res = join(item.index, children, {});
  var cns = elem.childNodes;
  var textNode = cns[item.start];
  if(textNode.nodeType == 1) {
    return;
  }
  var now = textNode.textContent;
  if(res != now) {
    // textContent自动转义，保留空白
    textNode.textContent = res || '';
  }
}

function value(item, children) {
  // 从item的index开始往后找，直到不是text为止，拼接所有text进行更新
  return join(item.index, children, {});
}

export default {
  update,
  value,
};
