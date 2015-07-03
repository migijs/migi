class Component extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  render() {
    return <Component2/>;
  }
}
class Component2 extends migi.Component {
  constructor(...data) {
    super(...data);
    this._txt = '123';
  }
  get txt() {
    return this._txt;
  }
  set txt(v) {
    this._txt = v;
  }
  click() {
    this.txt = '456';
  }
  render() {
    return <div>
      <p onClick={this.click}>click</p>
      <span>{this.txt}</span>
    </div>;
  }
}

var vd = migi.render(
  <Component/>,
  '#test'
);