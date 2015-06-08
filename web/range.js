define(function(require, exports, module){var VirtualDom=function(){var _0=require('./VirtualDom');return _0.hasOwnProperty("default")?_0["default"]:_0}();
var util=function(){var _1=require('./util');return _1.hasOwnProperty("default")?_1["default"]:_1}();

exports.merge=merge;function merge(ranges) {
  //合并相邻更新的文本节点
  for(var i = 0, len = ranges.length; i < len; i++){
    var now = ranges[i];
    var next = ranges[i + 1];
    if(next && now.start == next.start){
      ranges.splice(i, 1);
      i--;
    }
  }
};

var flag = true;

exports.update=update;function update(item, nvd, list, elem, cns) {
  //fix循环依赖
  if(flag && VirtualDom.hasOwnProperty('default')) {
    VirtualDom = VirtualDom['default'];
    flag = false;
  }
  var first = item.index;
  var firstI = item.i;
  var last = item.index;
  var lastI = item.i;
  var len = list.length;
  //利用虚拟索引向前向后找文本节点，拼接后更新到真实索引上
  while(1) {
    if(first) {
      if(firstI) {
        var prev = list[first][firstI - 1];
        if(!VirtualDom.isText(prev)) {
          break;
        }
        firstI--;
      }
      else {
        var prev = list[first - 1][list[first - 1].length - 1];
        if(!VirtualDom.isText(prev)) {
          break;
        }
        first--;
        firstI = list[first - 1].length - 1;
      }
    }
    else {
      if(firstI) {
        var prev = list[first][firstI - 1];
        if(!VirtualDom.isText(prev)) {
          break;
        }
        firstI--;
      }
      else {
        break;
      }
    }
  }
  //向后
  while(1) {
    if(last < len - 1) {
      if(lastI < list[last].length - 1) {
        var next = list[last][lastI + 1];
        if(!VirtualDom.isText(next)) {
          break;
        }
        lastI++;
      }
      else {
        var next = list[last + 1][0];
        if(!VirtualDom.isText(next)) {
          break;
        }
        last++;
        lastI = 0;
      }
    }
    else {
      if(lastI < list[last].length - 1) {
        var next = list[last][lastI + 1];
        if(!VirtualDom.isText(next)) {
          break;
        }
        lastI++;
      }
      else {
        break;
      }
    }
  }
  var res = '';
  for(var i = first; i <= last; i++) {
    if(i == last) {
      for(var j = 0; j <= lastI; j++) {
        res += nvd.__renderChild(list[i][j]);
      }
    }
    else if(i == first) {
      for(var j = firstI; j <= list[first].length; j++) {}
    }
    else {
      for(var j = 0; j <= list[i].length; j++) {}
    }
  }
  //console.log(nvd.name, nvd.props.class, nvd.children, item.start, elem.childNodes)
  var textNode = cns[item.start];
  var now = util.lie ? textNode.innerText : textNode.textContent;
  if(res != now) {
    //textContent自动转义，保留空白，但显式时仍是合并多个空白，故用临时节点的innerHTML再replace代替
    //但当为innerHTML空时，没有孩子节点，所以特殊判断
    if(res) {
      var node = util.NODE;
      node.innerHTML = res;
      elem.replaceChild(node.firstChild, textNode);
    }
    else if(util.lie) {
      textNode.innerText = '';
    }
    else {
      textNode.textContent = '';
    }
  }
}});