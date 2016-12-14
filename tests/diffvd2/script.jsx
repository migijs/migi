class Component extends migi.Component {
  constructor(...data) {
    super(...data);
    this.i = 0;
    this.a = <span></span>;
  }
  get a() {
    return this._a;
  }
  @bind
  set a(v) {
    this._a = v;
  }
  click() {
    switch(this.i++) {
      case 0:
        this.a = <span>1</span>;
        break;
      case 1:
        this.a = <span></span>;
        break;
      case 2:
        this.a = <span><b>2</b></span>;
        break;
      case 3:
        this.a = <span></span>;
        break;
      case 4:
        this.a = <span><b>3</b></span>;
        break;
      case 5:
        this.a = <span><small>1</small></span>;
        break;
      case 6:
        this.a = <span>2</span>;
        break;
    }
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