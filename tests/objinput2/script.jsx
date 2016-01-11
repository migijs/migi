class Component extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  get states() {
    return this._state;
  }
  set states(v) {
    this._state = v;
  }
  click() {
    this.states = !this.states;
  }
  render() {
    return <div>
        <p onClick={this.click}>click</p>
        <input type="radio" value="123" checked={this.states} ref="0"/>
        <input type="checkbox" value="123" checked={this.states} ref="1"/>
      </div>;
  }
}

migi.render(
  <Component />,
  '#test'
);