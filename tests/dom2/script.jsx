class Component extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  get s() {
    return this._s || 0;
  }
  set s(v) {
    this._s = v;
  }
  click() {
    this.s++;
  }
  render() {
    return <div>
      <span>{this.s}</span>
      <p onclick={this.click}>click</p>
    </div>;
  }
}

var c = migi.render(
  <Component/>,
  '#test'
);
c.appendTo('#test');
