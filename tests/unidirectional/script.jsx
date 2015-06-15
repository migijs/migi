class MyComponent extends migi.Component {
  constructor(...data) {
    super(...data);
    this._txt = 'like';
  }
  get txt() {
    return this._txt;
  }
  set txt(v) {
    this._txt = v;
  }
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