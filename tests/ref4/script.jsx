class Component extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  @bind d
  render() {
    return <div>
      {
        this.d
          ? <div>
              <Test ref="a"/>
              <p ref="b"/>
            </div>
          : <div>
            <p class="fn-placeholder-pic" ref="z"/>
            <p class="fn-placeholder-tags"/>
            <p class="fn-placeholder"/>
            <p class="fn-placeholder"/>
          </div>
      }
    </div>;
  }
}
class Test extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  render() {
    return <span></span>;
  }
}

let c = migi.render(
  <Component/>,
  '#test'
);
c.d = true;
document.getElementById('test2').innerHTML = c.ref.a.__name + "," + c.ref.b.__name + "," + (c.ref.z ? '1' : '2');
