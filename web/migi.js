define(function(require, exports, module){var lefty=function(){var _0=require('lefty');return _0.hasOwnProperty("lefty")?_0.lefty:_0.hasOwnProperty("default")?_0.default:_0}();
var Component=function(){var _1=require('./Component');return _1.hasOwnProperty("Component")?_1.Component:_1.hasOwnProperty("default")?_1.default:_1}();
var HtmlComponent=function(){var _2=require('./HtmlComponent');return _2.hasOwnProperty("HtmlComponent")?_2.HtmlComponent:_2.hasOwnProperty("default")?_2.default:_2}();
var Event=function(){var _3=require('./Event');return _3.hasOwnProperty("Event")?_3.Event:_3.hasOwnProperty("default")?_3.default:_3}();
var type=function(){var _4=require('./type');return _4.hasOwnProperty("type")?_4.type:_4.hasOwnProperty("default")?_4.default:_4}();

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
      return new (Function.prototype.bind.apply(HtmlComponent, [null,name,props].concat(function(){var _5=[],_6,_7=children[Symbol.iterator]();while(!(_6=_7.next()).done)_5.push(_6.value);return _5}())))();
    }
    else {
      var Klass = name;
      name = name.toString();
      name = /^function\s+([\w$]+)/.exec(name)[1];
      return new (Function.prototype.bind.apply(Klass, [null,name,props].concat(function(){var _8=[],_9,_10=children[Symbol.iterator]();while(!(_9=_10.next()).done)_8.push(_9.value);return _8}())))();
    }
  },
  findDOMNode: function(obj) {

  },
  eventBus: Event.mix({}),
  Component: Component
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