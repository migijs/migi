define(function(require, exports, module){var lefty=function(){var _0=require('lefty');return _0.hasOwnProperty("lefty")?_0.lefty:_0.hasOwnProperty("default")?_0.default:_0}();
var Event=function(){var _1=require('./Event');return _1.hasOwnProperty("Event")?_1.Event:_1.hasOwnProperty("default")?_1.default:_1}();
var type=function(){var _2=require('./type');return _2.hasOwnProperty("type")?_2.type:_2.hasOwnProperty("default")?_2.default:_2}();
var Component=function(){var _3=require('./Component');return _3.hasOwnProperty("Component")?_3.Component:_3.hasOwnProperty("default")?_3.default:_3}();
var HtmlComponent=function(){var _4=require('./HtmlComponent');return _4.hasOwnProperty("HtmlComponent")?_4.HtmlComponent:_4.hasOwnProperty("default")?_4.default:_4}();
var Obj=function(){var _5=require('./Obj');return _5.hasOwnProperty("Obj")?_5.Obj:_5.hasOwnProperty("default")?_5.default:_5}();

var migi = {
  render: function(component, dom) {
    var s = component.toString();
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
    return component;
  },
  createElement: function(name, props, children) {
    children=[].slice.call(arguments, 2);if(type.isString(name)) {
      return new (Function.prototype.bind.apply(HtmlComponent, [null,name,props].concat(function(){var _6=[],_7,_8=children[Symbol.iterator]();while(!(_7=_8.next()).done)_6.push(_7.value);return _6}())))();
    }
    else {
      var Klass = name;
      name = name.toString();
      name = /^function\s+([\w$]+)/.exec(name)[1];
      return new (Function.prototype.bind.apply(Klass, [null,name,props].concat(function(){var _9=[],_10,_11=children[Symbol.iterator]();while(!(_10=_11.next()).done)_9.push(_10.value);return _9}())))();
    }
  },
  eventBus: Event.mix({}),
  Component: Component,
  Obj: Obj
};

if(typeof window !== 'undefined') {!function(){
  window.migi = migi;
  function cb() {
    var head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
    var jsx = document.querySelectorAll('script');
    for(var i = 0, len = jsx.length; i < len; i++) {
      var node = jsx[i];
      if(node.getAttribute('type') == 'text/jsx') {
        var code = node.textContent || node.innerText || node.firstChild && node.firstChild.nodeValue || '';
        var charset = node.getAttribute('charset');
        var crossorigin = node.getAttribute('crossorigin');
        var script = document.createElement('script');
        if(charset) {
          script.charset = charset;
        }
        node.setAttribute("crossorigin", crossorigin);
        script.async = true;
        var res = lefty.parse(code, true);
        script.innerHTML = res.replace(/</g, '&lt;');
        head.appendChild(script);
      }
    }
  }
  if(document.readyState == 'complete' || document.readyState == 'interactive') {
    cb();
  }
  else {
    document.addEventListener('DOMContentLoaded', cb);
  }}();
}

exports.default=migi;});