class HelloMessage extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  render() {
    return <p onClick={ function() { document.querySelector('#test2').innerHTML = '2'; } }>This is a template.</p>;
  }
}

migi.preExist(<HelloMessage/>);
