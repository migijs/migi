class Component extends migi.Component {
  constructor(...data) {
    super(...data);
    this.a = 1;
  }
  @bind a
  input() {
    document.querySelector('#test2').innerHTML = this.a;
  }
  render() {
    return <div>
      <input value={ this.a } onInput={ this.input }/>
    </div>;
  }
}

migi.render(
  <Component/>,
  '#test'
);
