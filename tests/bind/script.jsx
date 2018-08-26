class Component extends migi.Component {
  constructor(...data) {
    super(...data);
    this.a = [1];
    this.b = [2];
    this.i = 0;
  }
  @bind a
  @bind b
  click() {
    switch(this.i++) {
      case 0:
        this.b = [3];
        break;
      case 1:
        this.b = [4];
        break;
      case 2:
        this.b.push(5);
        break;
      case 3:
        this.b.pop();
    }
  }
  render() {
    return (
      <div>
        <span onClick={ this.click }>click</span>
        <p>
          {
            this.a.map(() => {
              return this.b.map((item2) => {
                return item2;
              })
            })
          }
        </p>
      </div>
    );
  }
}

migi.render(
  <Component/>,
  '#test'
);
