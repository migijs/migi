define(function(require, exports, module){"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (e) {
  // chrome23+以上文本节点会相应事件取不到DOM对象
  if (e.target.nodeType == 3) {
    e.target = e.target.parentNode;
  }
};

;});