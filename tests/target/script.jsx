class Component extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  click(e, vd, tvd) {
    document.querySelector('#test2').innerHTML = vd.name;
    document.querySelector('#test3').innerHTML = tvd.name;
  }
  render() {
    return <p onclick={this.click}>123<span>456</span></p>;
  }
}

var c = new Component();
c.inTo('#test');
