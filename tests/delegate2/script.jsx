class Component extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  click(e,vd,tvd,ttvd) {
    e.preventDefault();
    document.querySelector('#test2').innerHTML = vd.name + tvd.name + ttvd.name;
  }
  render() {
    return (
      <ol onClick={ { 'a': this.click } }>
        <li><a href="#"><span>1</span></a></li>
      </ol>
    );
  }
}

migi.render(
  <Component/>,
  '#test'
);