class Shadow extends migi.Component {
  constructor(...data) {
    super(...data);
    this.allowPropagation = true;
  }
  click() {
    document.body.setAttribute('inner', 1);
  }
  render() {
    return <p class="p"><span onClick={ this.click }>text</span></p>;
  }
}

document.body.addEventListener('click', function() {
  document.body.setAttribute('outer', 1);
});

migi.render(
  <Shadow/>,
  '#test'
);