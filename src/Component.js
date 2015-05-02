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
    this.parent = null;
    this.id = uid();

    this.on(Event.DOM, this.onDom);
  }
  //需要被子类覆盖
  render() {
    return new HtmlComponent(this.name);
  }
  toString() {
    this.htmlComponent = this.render();
    this.htmlComponent.parent = this;
    return this.htmlComponent.toString();
  }

  onDom() {
    this.htmlComponent.emit(Event.DOM);
  }
}

export default Component;