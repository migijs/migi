class MyComponent extends migi.Component {
  constructor(...data) {
    super(...data);
    this.a = [1];
  }
  get a() {
    return this._a;
  }
  set a(v) {
    this._a = this._arr = v;
  }
  @link(a)
  get arr() {
    return this._arr;
  }
  click() {
    this.a.push(2);
  }
  render() {
    return (
      <p onClick={this.click}>
        { this.arr }
      </p>
    );
  }
}

migi.render(
  <MyComponent />,
  '#test'
);