var style = `
  div span{margin:2px}
`;

class Test extends migi.Component {
  constructor(...data) {
    super(...data);
    this._a = <span>123</span>;
    this.style = style;
  }
  get a() {
    return this._a;
  }
  @bind
  set a(v) {
    this._a = v;
  }
  click() {
    this.a = <span>456</span>;
  }

  render() {
    return (
      <div>
        <p onClick={this.click}>click</p>
        {this.a}
      </div>
    );
  }
}

migi.render(
  <Test/>,
  '#test'
);