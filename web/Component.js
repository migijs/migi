define(function(require, exports, module){var Event=function(){var _0=require('./Event');return _0.hasOwnProperty("Event")?_0.Event:_0.hasOwnProperty("default")?_0.default:_0}();

!function(){var _1=Object.create(Event.prototype);_1.constructor=Component;Component.prototype=_1}();
  function Component(name, props, chilren) {
    if(props===void 0)props={};chilren=[].slice.call(arguments, 2);Event.call(this);
    this.name = name;
    this.props = props;
    this.chilren = chilren;
    this.on(Event.DOM, this.onDom);
    this.on(Event.DATA, this.onData);
  }
  //需要被子类覆盖
  Component.prototype.render = function() {
    var self = this;
    var s = '<' + self.name;
    Object.keys(self.props).forEach(function(k) {
      s += ' ' + k + '="' + self.props[k] + '"'
    });
    s += '>';
    self.chilren.forEach(function(child) {
      if(child instanceof Component) {
        s += child.render();
      }
      else {
        s += child;
      }
    });
    s +='</' + self.name + '>';console.log(s)
    return s;
  }
  Component.prototype.onDom = function() {
    //TODO
  }
  Component.prototype.onData = function(k, v) {
    //TODO
  }
Object.keys(Event).forEach(function(k){Component[k]=Event[k]});

exports.default=Component;});