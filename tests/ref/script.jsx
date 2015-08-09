class Component extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  click() {
    this.ref.s.element.innerHTML = 'ref';
  }
  render() {
    return <div>
      <p ref="p" onClick={this.click}>click</p>
      <span ref="s"></span>
    </div>;
  }
}

migi.render(
  <Component/>,
  '#test'
);