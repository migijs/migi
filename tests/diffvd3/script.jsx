class Component extends migi.Component {
  constructor(...data) {
    super(...data);
    this.i = 0;
    this.a = <span dangerouslySetInnerHTML="1"></span>;
  }
  get a() {
    return this._a;
  }
  @bind
  set a(v) {
    this._a = v;
  }
  click() {
    this.a = <span>2</span>;
    this.record();
  }
  record() {
    document.querySelector('#test2').innerHTML = '^' + document.querySelector('#test span').childNodes.length + '$';
  }
  render() {
    return <div>
      <p onClick={this.click}>click</p>
      {this.a}
    </div>;
  }
}

var vd = migi.render(
  <Component/>,
  '#test'
);