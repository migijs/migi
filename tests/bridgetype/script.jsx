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
    return <p>{this.txt}</p>;
  }
}
class Component2 extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  get txt2() {
    return this._txt;
  }
  set txt2(v) {
    this._txt = v;
  }
  render() {
    return <p>{this.txt2}</p>;
  }
}

var vd = migi.render(
  <div>
    <Component/>
    <Component/>
    <Component/>
    <Component2/>
    <Component/>
    <Component2/>
    <Component/>
    <Component2/>
  </div>,
  '#test'
);

var cps = vd.$findAll(migi.Component);

cps[0].$bridge(cps[1], {
  'txt': function(v) {
    return v + v;
  }
});
cps[2].$bridge(cps[3], {
  'txt': {
    name: 'txt2'
  }
});
cps[4].$bridge(cps[5], {
  'txt': 'txt2'
});
cps[6].$bridge(cps[7], {
  'txt': {
    name: 'txt2',
    middleware: function(v) {
      return v + v + v;
    }
  }
});

cps[0].txt = 'txt';
cps[2].txt = 'txt';
cps[4].txt = 'txt';
cps[6].txt = 'txt';