class Model extends migi.Model {
  constructor(i) {
    super();
    this.count = i || 0;
  }
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
  render() {
    return <div>
      <p onClick={this.model.add}>click</p>
      <span>{this.model.count}</span>
    </div>;
  }
}

migi.render(
  <Component/>,
  '#test'
);