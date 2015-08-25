class Component extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  get index() {
    return this._index;
  }
  set index(v) {
    this._index = v;
  }
  click() {
    this.index = 2;
  }
  render() {
    return (
      <div>
        <p onClick={this.click}>click</p>
        <select selectedIndex={this.index}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
      </div>
    );
  }
}

migi.render(
  <Component />,
  '#test'
);