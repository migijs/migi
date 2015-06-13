migi.render(
  <h1>Hello, world!</h1>,
  '#test'
);

top && top.assert(document.querySelector('#test').innerHTML, '<h1 migi-uid="0">Hello, world!</h1>');