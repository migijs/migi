class MyComponent extends migi.Component {
  constructor(...data) {
    super(...data);
    this.arr = [1];
  }
  @bind
  set arr(v) {
    this._arr = v;
  }
  get arr() {
    return this._arr;
  }
  click() {
    this.arr.push(2);
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