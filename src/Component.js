import Event from './Event';
import type from './type';
import HtmlComponent from './HtmlComponent';
import uid from './uid';
import clone from './clone';

class Component extends Event {
  constructor(name, props = {}, ...children) {
    super();
    var self = this;
    self.__name = name;
    self.__props = props;
    Object.keys(props).forEach(function(k) {
      if(/^on[A-Z]/.test(k)) {
        var name = k.slice(2).replace(/[A-Z]/g, function(Up) {
          return Up.toLowerCase();
        });
        var cb = props[k];
        self.on(name, function(...data) {
          cb(...data);
        });
      }
    });

    self.__children = children;
    self.__childMap = {};
    children.forEach(function(child) {
      if(child instanceof Component) {
        if(self.childMap.hasOwnProperty(child.name)) {
          var temp = self.childMap[child.name];
          if(Array.isArray(temp)) {
            temp.push(child);
          }
          else {
            self.childMap[child.name] = [temp, child];
          }
        }
        else {
          self.childMap[child.name] = child;
        }
      }
    });

    self.__htmlComponent = null;
    self.__element = null;
    self.__parent = null;
    self.__id = uid();

    self.on(Event.DOM, self.__onDom);
    self.on(Event.DATA, self.__onData);
  }
  //需要被子类覆盖
  render() {
    var props = clone(this.props);
    props['migi-name'] = this.name;
    this.__element = new HtmlComponent('div', props, ...this.children);
    return this.element;
  }
  toString() {
    this.__htmlComponent = this.render();
    this.htmlComponent.parent = this;
    return this.htmlComponent.toString();
  }

  get name() {
    return this.__name;
  }
  get props() {
    return this.__props;
  }
  set props(v) {
    this.__props = v;
    this.emit(Event.DATA, 'props');
  }
  get children() {
    return this.__children;
  }
  get childMap() {
    return this.__childMap;
  }
  get htmlComponent() {
    return this.__htmlComponent;
  }
  get element() {
    return this.__element;
  }
  get parent() {
    return this.__parent;
  }
  get id() {
    return this.__id;
  }

  __onDom() {
    var self = this;
    self.htmlComponent.emit(Event.DOM);
    self.__element = self.htmlComponent.element;
    self.children.forEach(function(child) {
      if(child instanceof Component) {
        child.emit(Event.DOM);
      }
    });
    //将所有组件DOM事件停止冒泡，形成shadow特性，但不能阻止捕获
    function stopPropagation(e) {
      e.stopPropagation();
    }
    ['click', 'dblclick', 'focus', 'blur', 'change', 'abort', 'error', 'load', 'mousedown', 'mousemove', 'mouseover',
      'mouseup', 'mouseout', 'reset', 'resize', 'scroll', 'select', 'submit', 'unload', 'DOMActivate',
      'DOMFocusIn', 'DOMFocusOut'].forEach(function(name) {
        self.element.addEventListener(name, stopPropagation);
      });
  }
  __onData(target, k) {
    if(this.htmlComponent) {
      this.htmlComponent.emit(Event.DATA, target, k);
    }
    this.children.forEach(function(child) {
      if(child instanceof Component) {
        child.emit(Event.DATA, target, k);
      }
    });
  }
}

export default Component;