class Component extends migi.Component {
  constructor(...data) {
    super(...data);
    this._data = '';
  }
  get data() {
    return this._data;
  }
  set data(v) {
    this._data = v;
  }
  click() {
    this.data = [1,[[2,3],4]];
  }
  render() {
    return <div>
      <p onClick={this.click}>click</p>
      <div>{this.data}</div>
    </div>;
  }
}

migi.render(
  <Component/>,
  '#test'
);