var udf;

class Component extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  get value() {
    return this._value;
  }
  set value(v) {
    this._value = v;
  }
  get checked() {
    return this._checked;
  }
  set checked(v) {
    this._checked = v;
  }
  click() {
    this.value = this.value ? '' : '123';
    this.checked = !this.checked;
  }
  render() {
    return <div><p onClick={this.click}>click</p><input type="checkbox" value={this.value} checked={this.checked} name={udf} test={this.udf} data-test=""/></div>;
  }
}

migi.render(
  <Component/>,
  '#test'
);