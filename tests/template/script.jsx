class HelloMessage extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  render() {
    return <p>This is a template.</p>;
  }
}

document.querySelector('#test').innerHTML = new HelloMessage();
document.querySelector('#test2').innerHTML = migi.render('<p>This is a template too.</p>');