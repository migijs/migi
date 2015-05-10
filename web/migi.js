define(function(require, exports, module){var lefty=function(){var _0=require('lefty');return _0.hasOwnProperty("lefty")?_0.lefty:_0.hasOwnProperty("default")?_0.default:_0}();
var jaw=function(){var _1=require('jaw');return _1.hasOwnProperty("jaw")?_1.jaw:_1.hasOwnProperty("default")?_1.default:_1}();
var Event=function(){var _2=require('./Event');return _2.hasOwnProperty("Event")?_2.Event:_2.hasOwnProperty("default")?_2.default:_2}();
var Component=function(){var _3=require('./Component');return _3.hasOwnProperty("Component")?_3.Component:_3.hasOwnProperty("default")?_3.default:_3}();
var VirtualDom=function(){var _4=require('./VirtualDom');return _4.hasOwnProperty("VirtualDom")?_4.VirtualDom:_4.hasOwnProperty("default")?_4.default:_4}();
var NonVisualComponent=function(){var _5=require('./NonVisualComponent');return _5.hasOwnProperty("NonVisualComponent")?_5.NonVisualComponent:_5.hasOwnProperty("default")?_5.default:_5}();
var CacheComponent=function(){var _6=require('./CacheComponent');return _6.hasOwnProperty("CacheComponent")?_6.CacheComponent:_6.hasOwnProperty("default")?_6.default:_6}();
var util=function(){var _7=require('./util');return _7.hasOwnProperty("util")?_7.util:_7.hasOwnProperty("default")?_7.default:_7}();
var Obj=function(){var _8=require('./Obj');return _8.hasOwnProperty("Obj")?_8.Obj:_8.hasOwnProperty("default")?_8.default:_8}();
var Cb=function(){var _9=require('./Cb');return _9.hasOwnProperty("Cb")?_9.Cb:_9.hasOwnProperty("default")?_9.default:_9}();

var migi = {
  render:function(component, dom) {
    var s = component.toString();
    if(util.isDom(dom)) {
      dom.innerHTML = s;
    }
    else if(util.isString(dom)) {
      document.querySelector(dom).innerHTML = s;
    }
    else {
      throw new Error('migi.render missing dom target!');
    }
    component.emit(Event.DOM);
    return component;
  },
  createElement:function(name, props, children) {
    children=[].slice.call(arguments, 2);if(util.isString(name)) {
      return new (Function.prototype.bind.apply(VirtualDom, [null,name,props].concat(function(){var _10=[],_11,_12=children[Symbol.iterator]();while(!(_11=_12.next()).done)_10.push(_11.value);return _10}())))();
    }
    else {
      var Klass = name;
      name = name.toString();
      name = /^function\s+([\w$]+)/.exec(name)[1];
      return new (Function.prototype.bind.apply(Klass, [null,name,props].concat(function(){var _13=[],_14,_15=children[Symbol.iterator]();while(!(_14=_15.next()).done)_13.push(_14.value);return _13}())))();
    }
  },
  Event:Event,
  eventBus: Event.mix({}),
  Component:Component,
  NonVisualComponent:NonVisualComponent,
  CacheComponent:CacheComponent,
  VirtualDom:VirtualDom,
  Obj:Obj,
  Cb:Cb,
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