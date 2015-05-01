import lefty from 'lefty';
import Component from './Component';
import Event from './Event';
import type from './type';

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
  createElement: function(name, props, ...children) {
    if(type.isString(name)) {
      return new Component(name, props, ...children);
    }
    else {
      var Klass = name;
      name = name.toString();
      name = /^function\s+([\w$]+)/.exec(name)[1];
      return new Klass(name, props, ...children);
    }
  },
  eventBus: Event.mix({}),
  Component: Component
};

if(typeof window !== 'undefined') {
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
        script.innerHTML = lefty.parse(code, true).replace(/</g, '&lt;');
        head.appendChild(script);
      }
    }
  }
  if(document.readyState == 'complete' || document.readyState == 'interactive') {
    cb();
  }
  else {
    document.addEventListener('DOMContentLoaded', cb);
  }
}

export default migi;