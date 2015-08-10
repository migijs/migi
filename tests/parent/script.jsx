class Component extends migi.Component {
  constructor(...data) {
    super(...data);
    this.a = <span>123</span>;
  }
  get a() {
    return this._a;
  }
  set a(v) {
    this._a = v;
  }
  click() {
    this.a = <span>456</span>;
    this.find('strong').element.innerHTML = this.a.parent.name;
  }
  render() {
    return (
      <div attr="1">
        <p onClick={this.click}>click</p>
        {this.a}
        <strong></strong>
      </div>
    );
  }
}

migi.render(
  <Component />,
  '#test'
);