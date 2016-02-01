class State extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  click() {
    this.setState({
      txt: 1
    });
  }
  render() {
    return <p onClick={ this.click }>1{this.state.txt}</p>;
  }
}

migi.render(
  <State/>,
  '#test'
);