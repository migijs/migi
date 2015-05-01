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
    var self = this;
    var s = '<' + self.name;
    Object.keys(self.props).forEach(function(k) {
      s += ' ' + k + '="' + self.props[k] + '"'
    });
    s += '>';
    self.chilren.forEach(function(child) {
      if(child instanceof Component) {
        s += child.render();
      }
      else {
        s += child;
      }
    });
    s +='</' + self.name + '>';console.log(s)
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