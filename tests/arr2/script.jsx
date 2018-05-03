class MyComponent extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  @bind arr = [1]
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

migi.dev.optimizeArrayDiff = false;

migi.render(
  <MyComponent />,
  '#test'
);