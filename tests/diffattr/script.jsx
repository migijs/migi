function click1(e) {
  e.stopPropagation();
  document.body.querySelector('#test2').innerHTML += 1;
}
function click2(e) {
  e.stopPropagation();
  document.body.querySelector('#test2').innerHTML += 2;
}

class Component extends migi.Component {
  constructor(...data) {
    super(...data);
    this._data = <span a="1" b="2" onClick={click1}>1</span>;
  }
  get data() {
    return this._data;
  }
  @bind
  set data(v) {
    this._data = v;
  }
  click() {
    this.data = <span a="3" onClick={click2}>2</span>
  }
  render() {
    return <div onClick={this.click}>^{this.data}$</div>;
  }
}

var vd = migi.render(
  <Component/>,
  '#test'
);