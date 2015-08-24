class Component extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  get readonly() {
    return this._readonly;
  }
  set readonly(v) {
    this._readonly = !!v;
  }
  click() {
    this.readonly = !this.readonly;
  }
  render() {
    return (
      <div>
        <p onClick={this.click}>click</p>
        <input readonly={this.readonly}/>
        <span>{this.readonly}</span>
      </div>
    );
  }
}

migi.render(
  <Component />,
  '#test'
);