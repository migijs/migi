class Component extends migi.Component {
  constructor(...data) {
    super(...data);
    this.bridge(migi.eventBus, {
      'txt': 'txt'
    });
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
    this.bridgeTo(migi.eventBus, {
      'txt': 'txt'
    });
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
class Component3 extends migi.Component {
  constructor(...data) {
    super(...data);
    this.bridge(migi.eventBus, {
      'txt': 'txt34'
    });
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
class Component4 extends migi.Component {
  constructor(...data) {
    super(...data);
    this.bridgeTo(migi.eventBus, {
      'txt34': 'txt'
    });
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
class Component5 extends migi.Component {
  constructor(...data) {
    super(...data);
    this.bridge(migi.eventBus, {
      'txt5': function(v) {
        return v + v;
      }
    });
  }
  get txt5() {
    return this._txt;
  }
  set txt5(v) {
    this._txt = v;
  }
  render() {
    return <p>{this.txt5}</p>;
  }
}
class Component6 extends migi.Component {
  constructor(...data) {
    super(...data);
    this.bridgeTo(migi.eventBus, {
      'txt5': 'txt'
    });
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
class Component7 extends migi.Component {
  constructor(...data) {
    super(...data);
    this.bridge(migi.eventBus, {
      'txt7': {
        name: 'txt7'
      }
    });
  }
  get txt7() {
    return this._txt;
  }
  set txt7(v) {
    this._txt = v;
  }
  render() {
    return <p>{this.txt7}</p>;
  }
}
class Component8 extends migi.Component {
  constructor(...data) {
    super(...data);
    this.bridgeTo(migi.eventBus, {
      'txt7': 'txt'
    });
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
class Component9 extends migi.Component {
  constructor(...data) {
    super(...data);
    this.bridge(migi.eventBus, {
      'txt9': {
        name: 'txt99',
        middleware: function(v) {
          return v + v + v;
        }
      }
    });
  }
  get txt9() {
    return this._txt;
  }
  set txt9(v) {
    this._txt = v;
  }
  render() {
    return <p>{this.txt9}</p>;
  }
}
class Component10 extends migi.Component {
  constructor(...data) {
    super(...data);
    this.bridgeTo(migi.eventBus, {
      'txt99': 'txt'
    });
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

var vd = migi.render(
  <div>
    <Component/>
    <Component2/>
    <Component3/>
    <Component4/>
    <Component5/>
    <Component6/>
    <Component7/>
    <Component8/>
    <Component9/>
    <Component10/>
  </div>,
  '#test'
);

var cps = vd.findAll(migi.Component);

cps[0].txt = '11';
cps[2].txt = '22';
cps[4].txt5 = '33';
cps[6].txt7 = '44';
cps[8].txt9 = '55';