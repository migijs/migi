var vd = migi.render(
  <div>
    <span ref="1">1</span>
    <span ref="2">2</span>
  </div>,
  '#test'
);

var spans = vd.$findAll('span');

document.querySelector('#resvd').innerHTML = spans[0] == vd.$find('span');
document.querySelector('#res1').innerHTML = spans[0].toString();
document.querySelector('#res2').innerHTML = spans[1].toString();

class HelloMessage extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  render() {
    return <div>
      <p ref="3">3</p>
      <p ref="4">4</p>
    </div>;
  }
}

var component = migi.render(
  <HelloMessage name="migi"/>,
  '#test2'
);

var ps = component.$findAll('p');

document.querySelector('#rescp').innerHTML = ps[0] == component.$find('p');
document.querySelector('#res3').innerHTML = ps[0].toString();
document.querySelector('#res4').innerHTML = ps[1].toString();