define(function(require, exports, module){var lefty=function(){var _0=require('lefty');return _0.hasOwnProperty("lefty")?_0.lefty:_0.hasOwnProperty("default")?_0.default:_0}();
var Event=function(){var _1=require('./Event');return _1.hasOwnProperty("Event")?_1.Event:_1.hasOwnProperty("default")?_1.default:_1}();
var type=function(){var _2=require('./type');return _2.hasOwnProperty("type")?_2.type:_2.hasOwnProperty("default")?_2.default:_2}();
var Component=function(){var _3=require('./Component');return _3.hasOwnProperty("Component")?_3.Component:_3.hasOwnProperty("default")?_3.default:_3}();
var HtmlComponent=function(){var _4=require('./HtmlComponent');return _4.hasOwnProperty("HtmlComponent")?_4.HtmlComponent:_4.hasOwnProperty("default")?_4.default:_4}();
var NonVisualComponent=function(){var _5=require('./NonVisualComponent');return _5.hasOwnProperty("NonVisualComponent")?_5.NonVisualComponent:_5.hasOwnProperty("default")?_5.default:_5}();
var CacheComponent=function(){var _6=require('./CacheComponent');return _6.hasOwnProperty("CacheComponent")?_6.CacheComponent:_6.hasOwnProperty("default")?_6.default:_6}();
var Obj=function(){var _7=require('./Obj');return _7.hasOwnProperty("Obj")?_7.Obj:_7.hasOwnProperty("default")?_7.default:_7}();

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
      return new (Function.prototype.bind.apply(HtmlComponent, [null,name,props].concat(function(){var _8=[],_9,_10=children[Symbol.iterator]();while(!(_9=_10.next()).done)_8.push(_9.value);return _8}())))();
    }
    else {
      var Klass = name;
      name = name.toString();
      name = /^function\s+([\w$]+)/.exec(name)[1];
      return new (Function.prototype.bind.apply(Klass, [null,name,props].concat(function(){var _11=[],_12,_13=children[Symbol.iterator]();while(!(_12=_13.next()).done)_11.push(_12.value);return _11}())))();
    }
  },
  Event: Event,
  eventBus: Event.mix({}),
  Component: Component,
  NonVisualComponent: NonVisualComponent,
  CacheComponent: CacheComponent,
  HtmlComponent: HtmlComponent,
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
        script.innerHTML = res;
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