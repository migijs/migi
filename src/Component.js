import Event from './Event';
import type from './type';
import HtmlComponent from './HtmlComponent';
import uid from './uid';
import clone from './clone';

class Component extends Event {
  constructor(name, props = {}, ...children) {
    super();
    var self = this;
    self.name = name;
    self.props = props;
    self.children = children;
    self.childrenMap = {};
    children.forEach(function(child) {
      if(child instanceof Component) {
        if(self.childrenMap.hasOwnProperty(child.name)) {
          var temp = self.childrenMap[child.name];
          if(Array.isArray(temp)) {
            temp.push(child);
          }
          else {
            self.childrenMap[child.name] = [temp, child];
          }
        }
        else {
          self.childrenMap[child.name] = child;
        }
      }
    });
    self.htmlComponent = null;
    self.element = null;
    self.parent = null;
    self.id = uid();

    self.on(Event.DOM, self.__onDom);
    self.on(Event.DATA, self.__onData);
  }
  //需要被子类覆盖
  render() {
    var props = clone(this.props);
    props['migi-name'] = this.name;
    this.element = new HtmlComponent('div', props, ...this.children);
    return this.element;
  }
  toString() {
    this.htmlComponent = this.render();
    this.htmlComponent.parent = this;
    return this.htmlComponent.toString();
  }
  closestHtml(name) {
    var parent = this.parent;
    while(parent) {
      if(parent instanceof Component == false) {
        if(name && parent.name == name) {
          return parent;
        }
        return parent;
      }
      parent = parent.parent;
    }
    return document.body;
  }
  closeset(name) {
    var parent = this.parent;
    while(parent) {
      if(parent instanceof Component) {
        if(name && parent.name == name) {
          return parent;
        }
        return parent;
      }
      parent = parent.parent;
    }
  }

  __onDom() {
    var self = this;
    self.htmlComponent.emit(Event.DOM);
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