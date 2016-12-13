class Component extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  render() {
    return (
      <ol>
        <li><a href="#">1</a></li>
      </ol>
    );
  }
}
function click(e) {
  document.querySelector('#test2').innerHTML = e.target.innerHTML;
}
migi.render(
  <Component onClick={ { 'a': click } }/>,
  '#test'
);