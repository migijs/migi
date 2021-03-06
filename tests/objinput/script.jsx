class Component extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  get txt() {
    return this._txt;
  }
  @bind
  set txt(v) {
    this._txt = v;
  }
  click() {
    this.txt = this.txt ? null : '456';
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
        <textarea ref="8">123</textarea>
        <textarea ref="9">{"123"}</textarea>
        <textarea ref="10">{this.txt}</textarea>
      </div>;
  }
}

migi.render(
  <Component />,
  '#test'
);