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
    return <p>{this.model.b}</p>;
  }
}

class Model extends migi.Model {
  constructor() {
    super();
    this.a = 0;
    this.b = 0;
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
}

var a = new Model();
var b = new Model();

a.bridge(migi.eventBus, {
  'a': {
    name: 'b',
    middleware: function(v) {
      return v + 1;
    }
  }
});
b.bridgeTo(migi.eventBus, {
  'b': 'b'
});

var vd = migi.render(
  <div>
    <Component model={a}/>
    <Component2 model={b}/>
  </div>,
  '#test'
);

a.a = 1;