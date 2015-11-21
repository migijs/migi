window.onerror = function() {
  document.querySelector('#test2').innerHTML = 1;
}
class A extends migi.Component {
  constructor(...data) {
    super(...data);
    this.style = {".a":{"_:":[[["active"],{"_v":[],"_p":[0,1,1]}]]}};
  }
  render() {
    return <div class="a">123</div>;
  }
}
class Component extends migi.Component {
  constructor(...data) {
    super(...data);
    this._a = <A/>;
  }
  get a() {
    return this._a;
  }
  set a(v) {
    this._a = v;
  }
  render() {
    return <div>{this.a}</div>
  }
}
var c = migi.render(<Component/>, '#test');
c.a = <A/>;