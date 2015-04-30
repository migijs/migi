import Event from './Event';

class Component extends Event {
  constructor(name, props = {}, ...chilren) {
    super();
    this.name = name;
    this.props = props;
    this.chilren = chilren;
    this.on(Event.DOM, this.onDom);
    this.on(Event.DATA, this.onData);
  }
  //需要被子类覆盖
  render() {
    var s = '<' + this.name;
    Object.keys(this.props).forEach(function(k) {
      s += ' ' + k + '="' + this.props[k] + '"'
    });
    s += '>';
    this.chilren.forEach(function(child) {
      if(child instanceof Component) {
        s += child.render();
      }
      else {
        s += child;
      }
    });
    s +='</' + this.name + '>';
    return s;
  }
  onDom() {
    //TODO
  }
  onData(k, v) {
    //TODO
  }
}

export default Component;