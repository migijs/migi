class Component extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  get txt() {
    return this._txt;
  }
  set txt(v) {
    this._txt = v;
  }
  click() {
    this.txt = '456';
  }
  render() {
    return <div>
        <p onClick={this.click}>click</p>
        <input ref="0"/>
        <input type="text" ref="1"/>
        <input value="123" ref="2"/>
        <input type="text" value="123" ref="3"/>
        <input value={"123"} ref="4"/>
        <input type="text" value={"123"} ref="5"/>
        <input value={this.txt} ref="6"/>
        <input type="text" value={this.txt} ref="7"/>
      </div>;
  }
}

migi.render(
  <Component />,
  '#test'
);