class Component extends migi.CacheComponent {
  constructor(...data) {
    super(...data);
  }
  get txt() {
    return this._txt;
  }
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
    <Component/>
  </div>,
  '#test'
);

var cps = vd.findAll(migi.Component);

cps[0].bridge(cps[1], {
  'txt': 'txt'
});
cps[1].bridgeTo(cps[2], {
  'txt': 'txt'
});
cps[2].bridgeTo(cps[0], {
  'txt': 'txt'
});

cps[0].txt = 'txt';