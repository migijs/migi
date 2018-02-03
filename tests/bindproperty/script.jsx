class Out extends migi.Component {
  constructor(...data) {
    super(...data);
    this.p = 1;
  }
  @bind p
  click() {
    this.p = 2;
  }
  render() {
    return <div>
      <span onClick={ this.click }>click</span>
      <Inner @q={ this.p }/>
    </div>;
  }
}
class Inner extends migi.Component {
  constructor(...data) {
    super(...data);
    this.q = this.props.q;
  }
  @bind q
  render() {
    return <p>{ this.q }</p>
  }
}

migi.render(
  <Out />,
  '#test'
);