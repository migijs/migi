define(function(require, exports, module){var Event=function(){var _0=require('./Event');return _0.hasOwnProperty("Event")?_0.Event:_0.hasOwnProperty("default")?_0.default:_0}();
var HtmlComponent=function(){var _1=require('./HtmlComponent');return _1.hasOwnProperty("HtmlComponent")?_1.HtmlComponent:_1.hasOwnProperty("default")?_1.default:_1}();
var type=function(){var _2=require('./type');return _2.hasOwnProperty("type")?_2.type:_2.hasOwnProperty("default")?_2.default:_2}();

!function(){var _3=Object.create(Event.prototype);_3.constructor=Component;Component.prototype=_3}();
  function Component(name, props, children) {
    if(props===void 0)props={};children=[].slice.call(arguments, 2);Event.call(this);
    this.name = name;
    this.props = props;
    this.children = children;
  }
  //需要被子类覆盖
  Component.prototype.render = function() {
    return '<' + this.name + '/>';
  }
  Component.prototype.toString = function() {
    var self = this;
    var res = self.render();
    return res.toString();
  }
Object.keys(Event).forEach(function(k){Component[k]=Event[k]});

exports.default=Component;});