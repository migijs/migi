class Component extends migi.Component {
  constructor(...data) {
    super(...data);
    this._txt1 = '1<div>2';
    this._txt2 = '1&nbsp;&nbsp;2';
  }
  get txt1() {
    return this._txt1;
  }
  set txt1(v) {
    this._txt1 = v;
  }
  get txt2() {
    return this._txt2;
  }
  set txt2(v) {
    this._txt2 = v;
  }
  click() {
    this.txt1 = '1<div>2';
  }
  render() {
    return <div>
      <ul>
        <li ref="1">{this.txt1}</li>
        <li ref="2">{this.txt2}</li>
      </ul>
    </div>;
  }
}

migi.render(
  <Component/>,
  '#test'
);