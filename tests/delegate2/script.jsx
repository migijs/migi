class Component extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  click(e) {
    e.preventDefault();
    document.querySelector('#test2').innerHTML = 1;
  }
  render() {
    return (
      <ol onClick={ { 'a': this.click } }>
        <li><a href="#">1</a></li>
      </ol>
    );
  }
}

migi.render(
  <Component/>,
  '#test'
);