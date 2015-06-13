class Shadow extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  click() {
    document.body.setAttribute('inner', 1);
  }
  click2() {
    document.body.setAttribute('p', 1);
  }
  render() {
    return <p class="p" onClick={ this.click2 }><span onClick={ this.click }>text</span></p>;
  }
}

migi.render(
  <Shadow/>,
  '#test'
);