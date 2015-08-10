define(function(require, exports, module){exports["default"]=function(event) {
  //IE8
  if(!event.target) {
    event.target = event.srcElement || document;
    event.metaKey = !!event.metaKey;
    //停止冒泡
    event.stopPropagation = function() {
      event.cancelBubble = true;
    };
    //阻止默认行为
    event.preventDefault = function() {
      e.returnValue = false;
    };
  }
  //chrome23+以上文本节点会相应事件取不到DOM对象
  if(event.target.nodeType == 3) {
    event.target = event.target.parentNode;
  }
};});