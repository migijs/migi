class Component extends migi.Component {
  constructor(...data) {
    super(...data);
    this._txt = '';
  }
  get txt() {
    return this._txt;
  }
  @bind
  set txt(v) {
    this._txt = v;
  }
  click(e) {
    this.txt += 1;
  }
  render() {
    return (
      <div onClick={{
          'div': this.click
        }}>
        <span>span</span>
        <strong>{ this.txt }</strong>
      </div>
    );
  }
}

migi.render(
  <Component/>,
  '#test'
);