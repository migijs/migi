class Model extends migi.Model {
  constructor() {
    super();
  }
  @bind arr = [1]
}
class Component extends migi.Component {
  constructor(...data) {
    super(...data);
    this.model = new Model();
  }
  click() {
    this.model.arr.push(2);
  }
  render() {
    return <div>
      <p onClick={this.click}>click</p>
      <span>{ this.model.arr }</span>
    </div>;
  }
}

migi.render(
  <Component />,
  '#test'
);