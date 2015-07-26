define(function(require, exports, module){var Event=function(){var _0=require('./Event');return _0.hasOwnProperty("default")?_0["default"]:_0}();
var Component=function(){var _1=require('./Component');return _1.hasOwnProperty("default")?_1["default"]:_1}();
var browser=function(){var _2=require('./browser');return _2.hasOwnProperty("default")?_2["default"]:_2}();

!function(){var _3=Object.create(Component.prototype);_3.constructor=NonVisualComponent;NonVisualComponent.prototype=_3}();
  function NonVisualComponent(data) {
    data=[].slice.call(arguments, 0);Component.apply(this,[].concat(Array.from(data)));

    //ie8的对象识别hack
    if(browser.lie) {
      this.__migiNVCp = true;
    }
  }

  //非可视为空
  //@overwrite
  NonVisualComponent.prototype.toString = function() {
    return '';
  }

  //没有dom
  //@overwrite
  NonVisualComponent.prototype.__onDom = function() {
    this.__dom = true;
    Component.fakeDom(this.$children);
  }
Object.keys(Component).forEach(function(k){NonVisualComponent[k]=Component[k]});

exports["default"]=NonVisualComponent;});