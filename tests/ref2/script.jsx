class Component extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  click() {
    this.ref.s.virtualDom.element.innerHTML = 'ref';
  }
  render() {
    return <div>
      <p ref="p" onClick={this.click}>click</p>
      <Test ref="s"/>
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