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
        this.b = [<b>3</b>];
        break;
      case 1:
        this.b = [4];
        break;
      case 2:
        this.b = [<b>5</b>];
        break;
      case 3:
        this.b = [<b>6</b>];
        break;
      case 4:
        this.b = [7];
        break;
    }
    document.querySelector('#test2').innerHTML = document.querySelector('#test p').innerHTML.replace(/</g, '&lt;');
  }
  render() {
    return (
      <div>
        <span onClick={ this.click }>click</span>
        <p>
          {
            this.a.map(() => {
              this.b;
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
