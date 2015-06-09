define(function(require, exports, module){var Element=function(){var _0=require('./Element');return _0.hasOwnProperty("default")?_0["default"]:_0}();
var VirtualDom=function(){var _1=require('./VirtualDom');return _1.hasOwnProperty("default")?_1["default"]:_1}();
var Obj=function(){var _2=require('./Obj');return _2.hasOwnProperty("default")?_2["default"]:_2}();
var util=function(){var _3=require('./util');return _3.hasOwnProperty("default")?_3["default"]:_3}();

exports.merge=merge;function merge(ranges) {
  //合并相邻更新的文本节点
  for(var i = 0, len = ranges.length; i < len - 1; i++){
    var now = ranges[i];
    var next = ranges[i + 1];
    if(now.start == next.start){
      ranges.splice(i + 1, 1);
      i--;
      len--;
    }
  }
};

function join(index, children) {
  var res = '';
  for(var i = index.shift(), len = children.length; i < len; i++) {
    var child = children[i];
    if(index.length) {
      if(child instanceof Obj) {
        res += join(index, child.v);
      }
      else {
        res += join(index, child);
      }
    }
    else if(child instanceof Obj) {
      if(child.v instanceof Element) {
        break;
      }
      else {
        res += child === void 0 ? '' : child.toString();
      }
    }
    else if(child instanceof Element) {
      break;
    }
    else {
      res += child === void 0 ? '' : child.toString();
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
  var res = join(item.index, children);
  var cns = elem.childNodes;
  var textNode = cns[item.start];
  var now = util.lie ? textNode.innerText : textNode.textContent;
  if(res != now) {
    //textContent自动转义，保留空白
    //ie的innerText会解释html标签，故用临时节点的innerHTML再replace代替
    //但当为innerHTML空时，没有孩子节点，所以特殊判断
    if(res) {
      if(util.lie) {
        var node = util.NODE;
        node.innerHTML = res;
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
}});