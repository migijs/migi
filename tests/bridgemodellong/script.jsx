class Component extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  render() {
    return <p>{this.model.a}</p>;
  }
}
class Component2 extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  render() {
    return <p>{this.model.a}</p>;
  }
}
class Component3 extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  render() {
    return <p>{this.model.a}</p>;
  }
}

class Model extends migi.Model {
  constructor() {
    super();
    this.a = 0;
  }
  get a() {
    return this._a;
  }
  set a(v) {
    this._a = v;
  }
}

var a = new Model();
var b = new Model();
var c = new Model();

a.bridge(b, {
  'a': 'a'
});
b.bridge(a, {
  'a': 'a'
});
c.bridgeTo(b, {
  'a': 'a'
});

var vd = migi.render(
  <div>
    <Component model={a}/>
    <Component2 model={b}/>
    <Component3 model={c}/>
  </div>,
  '#test'
);

a.a = 1;