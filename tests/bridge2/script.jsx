class Component extends migi.CacheComponent {
  constructor(...data) {
    super(...data);
  }
  get txt() {
    return this._txt;
  }
  @bind
  set txt(v) {
    this._txt = v;
  }
  render() {
    return <span>{this.txt}</span>;
  }
}

var vd = migi.render(
  <div>
    <Component/>
    <Component/>
  </div>,
  '#test'
);

var cps = vd.findAll(Component);

cps[0].bridge(cps[1], {
  'txt': 'txt'
});
cps[0].bridgeTo(cps[1], {
  'txt': 'txt'
});

cps[0].txt = 'txt';