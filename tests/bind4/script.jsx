class Component extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  @bind a = [0]
  @bind b = [1, 2]
  @bind index = 0
  click() {
    this.index++;
  }
  render() {
    return <div>
      <span onClick={ this.click }>click</span>
      <p>
        {
          [this.a].map(() => {
            return <input value={ this.b[this.index] }/>;
          })
        }
      </p>
    </div>;
  }
}

migi.render(
  <Component/>,
  '#test'
);
