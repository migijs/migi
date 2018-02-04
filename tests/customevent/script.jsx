class Out extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  @bind a
  @bind b
  @bind c
  change(a, b) {
    this.a = a;
    this.b = b;
  }
  render() {
    return <div>
      <span>{ this.a }</span>
      <b>{ this.b }</b>
      <strong>{ this.c }</strong>
      <Inner on-change={this.change} on-change={ function() { this.c = 3; } }/>
    </div>;
  }
}
class Inner extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  click() {
    this.emit('change', 1, 2);
  }
  render() {
    return <p onClick={ this.click }>click</p>
  }
}

migi.render(
  <Out/>,
  '#test'
);