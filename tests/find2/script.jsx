class Component extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  render() {
    return <span>txt</span>;
  }
}

var vd = migi.render(
  <div>
    <Component/>
  </div>,
  '#test'
);

var cp = vd.$find(Component);

document.querySelector('#test2').innerHTML = cp instanceof Component;