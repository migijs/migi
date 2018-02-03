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
class Component extends migi.Component {
  constructor(...data) {
    super(...data);
    this.model = new Model();
  }
  click() {
    this.model.add();
  }
  render() {
    return <div>
      <p onClick={this.click}>click</p>
      <span>{this.model.count}</span>
    </div>;
  }
}

migi.render(
  <Component/>,
  '#test'
);