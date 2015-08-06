class List extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  get a() {
    return this._a;
  }
  set a(v) {
    this._a = v;
  }
  get b() {
    return this._b;
  }
  set b(v) {
    this._b = v;
  }
  render() {
    return (
      <p>
        {this.a} {this.b}
      </p>
    );
  }
}

var list = migi.render(
  <List />,
  '#test'
);
list.a = 1;
list.b = 2;