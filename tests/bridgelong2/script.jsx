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
class Component2 extends migi.Component {
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
    return <strong>{this.txt}</strong>;
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
    <Component2/>
    <CComponent/>
  </div>,
  '#test'
);

var cp = vd.find(Component);
var cp2 = vd.find(Component2);
var ccp = vd.find(CComponent);

cp.bridge(ccp, 'txt');
cp.bridgeTo(ccp, 'txt');
cp2.bridge(ccp, 'txt');
cp2.bridgeTo(ccp, 'txt');

cp.txt = 0;
cp.txt = 1;