class Component extends migi.Component {
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
    return <p>{this.txt}</p>;
  }
}
class CComponent extends migi.CacheComponent {
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
    <CComponent/>
  </div>,
  '#test'
);

var cp = vd.find(Component);
var ccp = vd.find(CComponent);

cp.bridge(ccp, 'txt');
cp.bridgeTo(ccp, 'txt');

ccp.txt = 0;
ccp.txt = 1;