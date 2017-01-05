class Model extends migi.Model {
  constructor() {
    super();
  }
  @bind arr = [1]
  click() {
    this.arr.push(2);
  }
}
class Component extends migi.Component {
  constructor(...data) {
    super(...data);
    this.model = new Model();
  }
  click() {
    this.model.arr.push(3);
  }
  render() {
    return <div>
      <p class="p1" onClick={this.model.click}>click1</p>
      <p class="p2" onClick={this.click}>click2</p>
      <span>{ this.model.arr }</span>
    </div>;
  }
}

migi.render(
  <Component />,
  '#test'
);