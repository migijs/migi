class Component extends migi.Component {
  constructor(...data) {
    super(...data);
    var i = 0;
    this._a = <span onClick={ function(e) {
      document.querySelector('#test2').innerHTML = i++;
    } }>111</span>;
  }
  get a() {
    return this._a;
  }
  set a(v) {
    this._a = v;
  }
  click(e) {
    this.a = <span>222</span>;
  }
  render() {
    return <div>
      <p onClick={this.click}>click</p>
      <span ref="span">{this.a}</span>
    </div>;
  }
}

migi.render(
  <Component>
  </Component>,
  '#test'
);