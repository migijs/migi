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
  click2(e) {
    this.txt += 2;
  }
  click3(e) {
    this.txt += 3;
  }
  render() {
    return (
      <div onClick={{
          'span,a': this.click,
          '.p': this.click2,
          '[hello="h"]': this.click3
        }}>
        <span>span</span>
        <p class="p" hello="h">p</p>
        <strong>{ this.txt }</strong>
      </div>
    );
  }
}

migi.render(
  <Component/>,
  '#test'
);