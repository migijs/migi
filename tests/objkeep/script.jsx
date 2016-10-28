class Component extends migi.Component {
  constructor(...data) {
    super(...data);
    this._txt1 = [1];
    this._txt2 = 5;
  }
  get txt1() {
    return this._txt1;
  }
  @bind
  set txt1(v) {
    this._txt1 = v;
  }
  get txt2() {
    return this._txt2;
  }
  @bind
  set txt2(v) {
    this._txt2 = v;
  }
  click1() {
    this.txt1 = [1, 2];
  }
  click2() {
    this.txt2 = [];
  }
  render() {
    return <div>
      <p onClick={this.click1} ref="c1">click1</p>
      <p onClick={this.click2} ref="c2">click2</p>
      <ul>
        <li ref="1">{this.txt2} {this.txt1}</li>
        <li ref="2">{this.txt1} {this.txt2}</li>
      </ul>
    </div>;
  }
}

migi.render(
  <Component/>,
  '#test'
);