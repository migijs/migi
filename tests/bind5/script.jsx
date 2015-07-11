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

var cps = vd.$findAll(Component);

cps[0].$bind(cps[1]);
cps[1].$bind(cps[2]);
cps[2].$bind(cps[0]);

cps[0].txt = 'txt';