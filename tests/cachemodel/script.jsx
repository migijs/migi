class Model extends migi.CacheModel {
  constructor() {
    super();
    this._i = 0;
  }
  set count(v) {
    this._i = v;
  }
  @bind
  get count() {
    return this._i;
  }
  add() {
    for(var i = 0; i < 100000; i++) {
      this.count++;
    }
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