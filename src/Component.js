import Event from './Event';
import type from './type';
import HtmlComponent from './HtmlComponent';
import uid from './uid';

class Component extends Event {
  constructor(name, props = {}, ...children) {
    super();
    this.name = name;
    this.props = props;
    this.children = children;
    this.htmlComponent = null;
    this.element = null;
    this.parent = null;
    this.id = uid();

    this.on(Event.DOM, this.onDom);
    this.on(Event.DATA, this.onData);
  }
  //需要被子类覆盖
  render() {
    this.element = new HtmlComponent(this.name);
    return this.element;
  }
  toString() {
    this.htmlComponent = this.render();
    this.htmlComponent.parent = this;
    return this.htmlComponent.toString();
  }

  onDom() {
    this.htmlComponent.emit(Event.DOM);
  }
  onData(target, k) {
    this.htmlComponent.emit('data', target, k);
  }
}

export default Component;