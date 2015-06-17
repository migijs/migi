class MyComponent extends migi.Component {
  constructor(...data) {
    super(...data);
    this.va = 1;
    this.vb = 2;
  }
  get a() {
    return this.va;
  }
  set a(v) {
    this.va = v;
  }
  get b() {
    return this.vb;
  }
  set b(v) {
    this.vb = v;
  }
  click1() {
    this.a++;
  }
  click2() {
    this.b++;
  }
  render() {
    return (
      <div>
        <p ref="a" onClick={this.click1}>点击a++</p>
        <p ref="b" onClick={this.click2}>点击b++</p>
        <p ref="1">a: {this.a}, b: {this.b}, max: {Math.max(this.a, this.b)}</p>
        <p ref="2">{[this.a, this.b]}</p>
        <p ref="3">{ sum(this.a, this.b)}</p>
        <p ref="4">{ this.a * this.b}</p>
      </div>
    );
  }
}

function sum(a, b) {
  return a + b;
}

migi.render(
  <MyComponent />,
  '#test'
);