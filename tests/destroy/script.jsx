class Component extends migi.Component {
  constructor(...data) {
    super(...data);
    var self = this;
    self.data = <Component2/>;
    self.data.on(migi.Event.DESTROY, function() {
      self.txt = 1;
    });
    self.txt = '';
    self.on(migi.Event.DOM, function() {
      self.data = <Component2/>;
    });
  }
  get data() {
    return this._data;
  }
  set data(v) {
    this._data = v;
  }
  get txt() {
    return this._txt;
  }
  set txt(v) {
    this._txt = v;
  }
  render() {
    return <div>
      {this.data}
      <p>{this.txt}</p>
    </div>;
  }
}
class Component2 extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  render() {
    return <span>123</span>;
  }
}

migi.render(
  <Component/>,
  '#test'
);