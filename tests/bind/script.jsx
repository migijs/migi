class Component extends migi.Component {
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
  </div>,
  '#test'
);

var cps = vd.findAll(Component);

cps[0].bind(cps[1]);

cps[0].txt = 'txt';