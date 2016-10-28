class CacheComponent extends migi.CacheComponent {
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
  render() {
    return <div>{this.count}</div>;
  }
}

var vd = migi.render(
  <div>
    <CacheComponent/>
    <CacheComponent/>
    <CacheComponent/>

    <CacheComponent/>
    <CacheComponent/>
    <CacheComponent/>
  </div>,
  '#test'
);

var cp = vd.findAll(CacheComponent);

cp[0].bridge(cp[1], 'count');
cp[0].bridge(cp[2], 'count');
cp[1].bridge(cp[2], 'count');

cp[0].count = 1;
cp[1].count = 2;

cp[3].bridge(cp[4], 'count');
cp[3].bridge(cp[5], 'count');
cp[4].bridge(cp[5], 'count');

cp[4].count = 2;
cp[3].count = 1;