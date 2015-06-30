class Component extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  get state() {
    return this._state;
  }
  set state(v) {
    this._state = v;
  }
  click() {
    this.state = !this.state;
  }
  render() {
    return <div>
        <p onClick={this.click}>click</p>
        <input type="radio" value="123" checked={this.state} ref="0"/>
        <input type="checkbox" value="123" checked={this.state} ref="1"/>
      </div>;
  }
}

migi.render(
  <Component />,
  '#test'
);