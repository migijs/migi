class CacheModel extends migi.CacheModel {
  constructor(...data) {
    super(...data);
    this._count = 0;
  }
  get count() {
    return this._count;
  }
  @bind
  set count(v) {
    this._count = v;
  }
}
class Component extends migi.Component {
  constructor(...data) {
    super(...data);
    this.model = new CacheModel();
  }
  render() {
    return <div>{this.model.count}</div>;
  }
}

var vd = migi.render(
  <div>
    <Component/>
    <Component/>
    <Component/>
    <Component/>
  </div>,
  '#test'
);

var cp = vd.findAll(Component);

cp[0].model.bridge(cp[1].model, 'count');
cp[2].model.bridge(cp[3].model, 'count');

cp[0].model.count = 1;
cp[1].model.count = 2;
cp[3].model.count = 3;
cp[2].model.count = 4;