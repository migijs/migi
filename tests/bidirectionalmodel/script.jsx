class Model extends migi.Model {
  constructor(...data) {
    super(...data);
    this._txt = 'Hello!';
  }
  get txt() {
    return this._txt;
  }
  set txt(v) {
    this._txt = v;
  }
}

class Input extends migi.Component {
  constructor(...data) {
    super(...data);
    this.model = new Model();
  }
  render() {
    return (
      <div>
        <input value={this.model.txt}/>
        <p>{this.model.txt}</p>
      </div>
    );
  }
}

migi.render(
  <Input />,
  '#test'
);