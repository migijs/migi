class CacheComponent extends migi.CacheComponent {
  constructor(...data) {
    super(...data);
    this._count = 0;
  }
  get count() {
    return this._count;
  }
  set count(v) {
    this._count = v;
  }
  render() {
    return <div>{this.count}</div>;
  }
}
class Component extends migi.Component {
  constructor(...data) {
    super(...data);
    this._count = 0;
  }
  get count() {
    return this._count;
  }
  set count(v) {
    this._count = v;
  }
  render() {
    return <div>{this.count}</div>;
  }
}

var vd = migi.render(
  <div>
    <Component/>
    <CacheComponent/>
    <Component/>
    <CacheComponent/>
  </div>,
  '#test'
);

var cp = vd.findAll(migi.Component);

cp[0].bridge(cp[1], 'count');
cp[2].bridge(cp[3], 'count');

cp[0].count = 1;
cp[1].count = 2;
cp[3].count = 3;
cp[2].count = 4;