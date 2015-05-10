import lefty from 'lefty';
import jaw from 'jaw';
import Event from './Event';
import type from './type';
import Component from './Component';
import VirtualDom from './VirtualDom';
import NonVisualComponent from './NonVisualComponent';
import CacheComponent from './CacheComponent';
import Obj from './Obj';
import Cb from './Cb';

var migi = {
  render(component, dom) {
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
  createElement(name, props, ...children) {
    if(type.isString(name)) {
      return new VirtualDom(name, props, ...children);
    }
    else {
      var Klass = name;
      name = name.toString();
      name = /^function\s+([\w$]+)/.exec(name)[1];
      return new Klass(name, props, ...children);
    }
  },
  Event: Event,
  eventBus: Event.mix({}),
  Component: Component,
  NonVisualComponent: NonVisualComponent,
  CacheComponent: CacheComponent,
  VirtualDom: VirtualDom,
  Obj: Obj,
  Cb: Cb,
  es5: true,
  css: true
};

if(typeof window !== 'undefined') {
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
  }
}

export default migi;