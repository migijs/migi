var Component=function(){var _0=require('./Component');return _0.hasOwnProperty("Component")?_0.Component:_0.hasOwnProperty("default")?_0.default:_0}();
var Event=function(){var _1=require('./Event');return _1.hasOwnProperty("Event")?_1.Event:_1.hasOwnProperty("default")?_1.default:_1}();
var type=function(){var _2=require('./type');return _2.hasOwnProperty("type")?_2.type:_2.hasOwnProperty("default")?_2.default:_2}();

var migi = {
  render: function(component, dom) {
    var s = component.render();
    if(type.isDom(dom)) {
      dom.innerHTML = s;
    }
    else if(type.isString(dom)) {
      document.querySelector(dom).innerHTML = s;
    }
    else {
      throw new Error('migi.render missing dom target!');
    }
    component.emit(Event.DOM);
    return s;
  },
  createElement: function(name, props, chilren) {
    chilren=[].slice.call(arguments, 2);if(type.isString(name)) {
      return new (Function.prototype.bind.apply(Component, [name,props].concat(function(){var _3=[],_4;while(!(_4=chilren.next()).done)_3.push(_4.value);return _3}())))();
    }
    else {
      var Klass = name;
      name = name.toString();
      name = /^function\s+([\w$]+)/.exec(name)[1];
      return new (Function.prototype.bind.apply(Klass, [name,props].concat(function(){var _5=[],_6;while(!(_6=chilren.next()).done)_5.push(_6.value);return _5}())))();
    }
  },
  eventBus: Event.mix({}),
  Component: Component
};

if(typeof window !== 'undefined') {
  window.migi = migi;
}

exports.default=migi;