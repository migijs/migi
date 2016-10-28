class Component extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  get v() {
    return this._v;
  }
  @bind
  set v(v) {
    this._v = v;
  }
  render() {
    return <select value={this.v}>
      <option value="0">0</option>
      <option value="1">1</option>
    </select>;
  }
}

var c = new Component();
c.inTo('#test');

c.v = 1;