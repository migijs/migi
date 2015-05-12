define(function(require, exports, module){var Component=function(){var _0=require('./Component');return _0.hasOwnProperty("Component")?_0.Component:_0.hasOwnProperty("default")?_0.default:_0}();

!function(){var _1=Object.create(Component.prototype);_1.constructor=NonVisualComponent;NonVisualComponent.prototype=_1}();
  function NonVisualComponent(data) {
    data=[].slice.call(arguments, 0);Component.apply(this,[].concat(Array.from(data)));
  }

  //非可视为空
  NonVisualComponent.prototype.toString = function() {
    return '';
  }

  //没有dom
  NonVisualComponent.prototype.__onDom = function() {}
Object.keys(Component).forEach(function(k){NonVisualComponent[k]=Component[k]});

exports.default=NonVisualComponent;});