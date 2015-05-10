define(function(require, exports, module){var lefty=function(){var _0=require('lefty');return _0.hasOwnProperty("lefty")?_0.lefty:_0.hasOwnProperty("default")?_0.default:_0}();
var jaw=function(){var _1=require('jaw');return _1.hasOwnProperty("jaw")?_1.jaw:_1.hasOwnProperty("default")?_1.default:_1}();
var Event=function(){var _2=require('./Event');return _2.hasOwnProperty("Event")?_2.Event:_2.hasOwnProperty("default")?_2.default:_2}();
var type=function(){var _3=require('./type');return _3.hasOwnProperty("type")?_3.type:_3.hasOwnProperty("default")?_3.default:_3}();
var Component=function(){var _4=require('./Component');return _4.hasOwnProperty("Component")?_4.Component:_4.hasOwnProperty("default")?_4.default:_4}();
var HtmlComponent=function(){var _5=require('./HtmlComponent');return _5.hasOwnProperty("HtmlComponent")?_5.HtmlComponent:_5.hasOwnProperty("default")?_5.default:_5}();
var NonVisualComponent=function(){var _6=require('./NonVisualComponent');return _6.hasOwnProperty("NonVisualComponent")?_6.NonVisualComponent:_6.hasOwnProperty("default")?_6.default:_6}();
var CacheComponent=function(){var _7=require('./CacheComponent');return _7.hasOwnProperty("CacheComponent")?_7.CacheComponent:_7.hasOwnProperty("default")?_7.default:_7}();
var Obj=function(){var _8=require('./Obj');return _8.hasOwnProperty("Obj")?_8.Obj:_8.hasOwnProperty("default")?_8.default:_8}();
var Cb=function(){var _9=require('./Cb');return _9.hasOwnProperty("Cb")?_9.Cb:_9.hasOwnProperty("default")?_9.default:_9}();

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
      return new (Function.prototype.bind.apply(HtmlComponent, [null,name,props].concat(function(){var _10=[],_11,_12=children[Symbol.iterator]();while(!(_11=_12.next()).done)_10.push(_11.value);return _10}())))();
    }
    else {
      var Klass = name;
      name = name.toString();
      name = /^function\s+([\w$]+)/.exec(name)[1];
      return new (Function.prototype.bind.apply(Klass, [null,name,props].concat(function(){var _13=[],_14,_15=children[Symbol.iterator]();while(!(_14=_15.next()).done)_13.push(_14.value);return _13}())))();
    }
  },
  Event: Event,
  eventBus: Event.mix({}),
  Component: Component,
  NonVisualComponent: NonVisualComponent,
  CacheComponent: CacheComponent,
  HtmlComponent: HtmlComponent,
  Obj: Obj,
  Cb: Cb,
  es5: true,
  css: true
};

if(typeof window !== 'undefined') {!function(){
  window.migi = migi;
  function cb() {
    setTimeout(function() {
      var head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
      var css = '';
      if(migi.css) {
        var style = document.querySelectorAll('style');
        for (var i = 0, len = style.length; i < len; i++) {
          var node = style[i];
          var code = node.textContent || node.innerText || node.firstChild && node.firstChild.nodeValue || '';
          css += code;
        }
      }
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
          if(crossorigin) {
            node.setAttribute("crossorigin", crossorigin);
          }
          script.async = true;
          if(migi.css) {
            code = jaw.parse(code, css);
          }
          var res = lefty.parse(code, migi.es5);
          script.innerHTML = res;
          head.appendChild(script);
        }
      }
    }, 1);
  }
  if(document.readyState == 'complete' || document.readyState == 'interactive') {
    cb();
  }
  else {
    document.addEventListener('DOMContentLoaded', cb);
  }}();
}

exports.default=migi;});