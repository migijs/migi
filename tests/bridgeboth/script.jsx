class Component extends migi.Component {
  constructor(...data) {
    super(...data);
    var self = this;
    self.bridge(migi.eventBus, {
      'txt': 'txt'
    });
    self.bridgeTo(migi.eventBus, {
      'txt': 'txt'
    });
    setTimeout(function() {
      self.txt = 'from a';
    }, 1);
  }
  get txt() {
    return this._txt;
  }
  set txt(v) {
    this._txt = v;
  }
  render() {
    return <p>{this.txt}</p>;
  }
}
class Component2 extends migi.Component {
  constructor(...data) {
    super(...data);
    var self = this;
    self.bridge(migi.eventBus, {
      'txt': 'txt'
    });
    self.bridgeTo(migi.eventBus, {
      'txt': 'txt'
    });
  }
  get txt() {
    return this._txt;
  }
  set txt(v) {
    this._txt = v;
  }
  render() {
    return <p>{this.txt}</p>;
  }
}

migi.render(
  <div>
    <Component/>
    <Component2/>
  </div>,
  '#test'
);