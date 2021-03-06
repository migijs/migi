class Component extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  @bind d
  click() {
    this.d = !this.d;
    this.ref.mes.element.innerHTML = this.ref.test ? 'yes' : 'no';
  }
  render() {
    return <div>
      <strong onClick={this.click}>click</strong>
      <p ref="mes">empty</p>
      {
        this.d ? <Test ref="test"/> : ''
      }
    </div>;
  }
}
class Test extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  render() {
    return <span></span>;
  }
}

migi.render(
  <Component/>,
  '#test'
);