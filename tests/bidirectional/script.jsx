class Input extends migi.Component {
  constructor(...data) {
    super(...data);
    this._txt = 'Hello!';
  }
  get txt() {
    return this._txt;
  }
  @bind
  set txt(v) {
    this._txt = v;
  }
  render() {
    return (
      <div>
        <input value={this.txt} ref="1"/>
        <input placeholder={this.txt} ref="2"/>
        <p>{this.txt}</p>
        <textarea>{this.txt}</textarea>
      </div>
    );
  }
}

migi.render(
  <Input />,
  '#test'
);