class MyComponent extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  @bind txt = 'like';
  handleClick() {
    this.txt = this.txt == 'like' ? 'unlike' : 'like';
  }
  render() {
    return (
      <p onClick={this.handleClick}>
        You {this.txt} this. Click to toggle.
      </p>
    );
  }
}

migi.render(
  <MyComponent />,
  '#test'
);