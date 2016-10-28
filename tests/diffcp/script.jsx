class Component extends migi.Component {
  constructor(...data) {
    super(...data);
    this.i = 0;
  }
  get cp() {
    return this._cp;
  }
  @bind
  set cp(v) {
    this._cp = v;
  }
  click() {
    switch(this.i++) {
      case 0:
        this.cp = <Component2/>;
        break;
      case 1:
        this.cp = <Component2/>;
        break;
      case 2:
        var temp = <Component2/>;
        temp.txt = '234';
        this.cp = temp;
        break;
      case 3:
        this.cp = <Component2/>;
        break;
      case 4:
        this.cp = <Component3/>;
        break;
      case 5:
        this.cp = <Component2/>;
        break;
      case 6:
        this.cp = 'txt';
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
  @bind
  set txt(v) {
    this._txt = v;
  }
  click() {
    this.txt = 'c22';
  }
  render() {
    return <div>
      <p onClick={this.click} ref="2">click</p>
      <span ref="3">{this.txt}</span>
    </div>;
  }
}
class Component3 extends migi.Component {
  constructor(...data) {
    super(...data);
    this._txt = 'c3';
  }
  get txt() {
    return this._txt;
  }
  @bind
  set txt(v) {
    this._txt = v;
  }
  click() {
    this.txt = 'c33';
  }
  render() {
    return <div>
      <p onClick={this.click} ref="4">click</p>
      <span ref="5">{this.txt}</span>
    </div>;
  }
}

var vd = migi.render(
  <Component/>,
  '#test'
);