class Component extends migi.Component {
  constructor(...data) {
    super(...data);
    this.i = 0;
  }
  get a() {
    return this._a;
  }
  set a(v) {
    this._a = v;
  }
  click() {
    switch(this.i++) {
      case 0:
        this.a = <span>1</span>;
        break;
      case 1:
        this.a = <span>2</span>;
        break;
      case 2:
        this.a = <b>3</b>;
        break;
      case 3:
        this.a = <div><span>4</span></div>;
        break;
      case 4:
        this.a = <span>5</span>;
        break;
    }
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