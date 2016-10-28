class Model extends migi.Model {
  constructor() {
    super();
    this._i = 0;
  }
  @bind
  set count(v) {
    this._i = v;
  }
  get count() {
    return this._i;
  }
  add() {
    this.count++;
  }
}
var model = new Model();

class Component extends migi.Component {
  constructor(...data) {
    super(...data);
    this.model = model;
  }
  render() {
    return <p>{this.model.count}</p>;
  }
}
class Component2 extends migi.Component {
  constructor(...data) {
    super(...data);
    this.model = model;
  }
  render() {
    return <p>{this.model.count}</p>;
  }
}

migi.render(
  <div>
    <Component/>
    <Component/>
    <Component2/>
  </div>,
  '#test'
);

model.add();