class Component extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  click(e, vd) {
    let a = vd.closest('a');
    let b = vd.closest('#b');
    let span = vd.closest('.span');
    document.getElementById('test2').innerHTML = !!a + ',' + !!b + ',' + !!span;
  }
  render() {
    return <div>
      <p onClick={this.click}>click</p>
      <span class="span"><b id="b"><a href="#" onClick={ this.click }>click</a></b></span>
    </div>;
  }
}

migi.render(
  <Component/>,
  '#test'
);