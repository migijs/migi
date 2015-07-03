class Component extends migi.Component {
  constructor(...data) {
    super(...data);
    this.i = 0;
    this.cp = <Component2/>;
  }
  get cp() {
    return this._cp;
  }
  set cp(v) {
    this._cp = v;
  }
  click() {
    switch(this.i++) {
      case 0:
        this.cp = <Component2/>;
        break;
    }
  }
  render() {
    return <div>
      <p onClick={this.click} ref="0">click</p>
      <div ref="1">{this.cp}</div>
    </div>;
  }
}
class Component2 extends migi.Component {
  constructor(...data) {
    super(...data);
    this._txt = 'c2';
  }
  get txt() {
    return this._txt;
  }
  set txt(v) {
    this._txt = v;
  }
  render() {
    return <div>
      <p ref="2">{this.txt}</p>
      <input ref="3" value={this.txt}/>
    </div>;
  }
}

var vd = migi.render(
  <Component/>,
  '#test'
);