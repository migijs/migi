define(function(require, exports, module){exports["default"]=function(e) {
  //IE8
  if(!e.target) {
    e.target = e.srcElement || document;
    e.metaKey = !!e.metaKey;
    //停止冒泡
    e.stopPropagation = function() {
      e.cancelBubble = true;
    };
    //阻止默认行为
    e.preventDefault = function() {
      e.returnValue = false;
    };
  }
  //chrome23+以上文本节点会相应事件取不到DOM对象
  if(e.target.nodeType == 3) {
    e.target = e.target.parentNode;
  }
};});