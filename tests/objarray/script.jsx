class Component extends migi.Component {
  constructor(...data) {
    super(...data);
    this._txt1 = ['1<div>2'];
    this._txt2 = ['1&nbsp;&nbsp;2'];
    this._dom1 = [<span>3</span>];
    this._dom2 = [<span>4</span>];
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
  get dom1() {
    return this._dom1;
  }
  set dom1(v) {
    this._dom1 = v;
  }
  get dom2() {
    return this._dom2;
  }
  click() {
    this.txt1 = ['1<div>3'];
    this.txt2 = ['1&nbsp;&nbsp;3'];
    this.dom1 = [<span>4</span>];
  }
  render() {
    return <div>
      <p onClick={this.click}>click</p>
      <ul>
        <li ref="1" test={this.txt1}>{this.txt1}</li>
        <li ref="2" test={this.txt2}>{this.txt2}</li>
        <li ref="3" test={this.dom1}>{this.dom1}</li>
        <li ref="4" test={this.dom2}>{this.dom2}</li>
      </ul>
    </div>;
  }
}

migi.render(
  <Component/>,
  '#test'
);