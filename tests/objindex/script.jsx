class Component extends migi.Component {
  constructor(...data) {
    super(...data);
    this.index = 0;
    this.list = [
      [1, 2, 3, 4],
      [5, 6, 7]
    ];
  }

  get index() {
    return this._index || 0;
  }
  set index(v) {
    this._index = v;
  }
  click() {
    this.index++;
    this.element.querySelector('p.a').innerHTML = this.find('div').element.childNodes.length;
    this.element.querySelector('p.b').innerHTML = this.find('div').element.innerHTML.replace(/</g, '&lt;');
  }

  render() {
    return <div onClick={this.click}>
      <p class="a"></p>
      <p class="b"></p>
      <div>
        { this.index ? '' : '' }
        {
          this.list[this.index].map(function(item) {
            return <span>{ item }</span>;
            })
          }
      </div>
    </div>;
  }
}

migi.render(
  <Component/>,
  '#test'
);