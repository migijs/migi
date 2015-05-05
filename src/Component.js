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

  __onDom() {
    this.htmlComponent.emit(Event.DOM);
    this.children.forEach(function(child) {
      if(child instanceof Component) {
        child.emit(Event.DOM);
      }
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