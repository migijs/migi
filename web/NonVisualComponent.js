define(function(require, exports, module){var Event=function(){var _0=require('./Event');return _0.hasOwnProperty("default")?_0["default"]:_0}();
var Component=function(){var _1=require('./Component');return _1.hasOwnProperty("default")?_1["default"]:_1}();

!function(){var _2=Object.create(Component.prototype);_2.constructor=NonVisualComponent;NonVisualComponent.prototype=_2}();
  function NonVisualComponent(data) {
    data=[].slice.call(arguments, 0);Component.apply(this,[].concat(Array.from(data)));
  }

  //非可视为空
  //@overwrite
  NonVisualComponent.prototype.toString = function() {
    if(this.children.length) {
      return Component.prototype.toString.call(this);
    }
    return '';
  }

  //没有dom
  //@overwrite
  NonVisualComponent.prototype.__onDom = function() {
    this.__dom = true;
  }
Object.keys(Component).forEach(function(k){NonVisualComponent[k]=Component[k]});

exports["default"]=NonVisualComponent;});