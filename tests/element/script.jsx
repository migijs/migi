class MyComponent extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  handleClick() {
    this.element.querySelector('[ref]').value = '1';
  }
  render() {
    return (
      <div>
        <input type="text" ref="myTextInput" />
        <input type="button" value="Focus the text input" onClick={this.handleClick} />
      </div>
    );
  }
}

migi.render(
  <MyComponent />,
  '#test'
);