class Component extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  @bind html = '<strong>使用html</strong>';
  render() {
    return <div dangerouslySetInnerHTML={ this.html }></div>;
  }
}

migi.render(
  <Component/>,
  document.querySelector('#test')
);