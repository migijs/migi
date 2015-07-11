class Component extends migi.Component {
  constructor(...data) {
    super(...data);
    this._data = '';
    this.i = 0;
  }
  get data() {
    return this._data;
  }
  set data(v) {
    this._data = v;
  }
  record() {
    this.element.querySelector('[ref]').innerHTML = '^'
      + this.element.querySelector('div').innerHTML.replace(/</g, '&lt;')
      + '$'
      + this.element.querySelector('div').childNodes.length;
  }
  click() {
    switch(this.i++) {
      case 0:
        this.data = [<span>d</span>, [], <span>d</span>];
        break;
      case 1:
        this.data = [<span>d</span>, [<span>d</span>], <span>d</span>];
        break;
      case 2:
        this.data = [<span>d</span>, [], <span>d</span>];
        break;
      case 3:
        this.data = [<span>d</span>, [1], <span>d</span>];
        break;
      case 4:
        this.data = [<span>d</span>, [1, 2], <span>d</span>];
        break;
      case 5:
        this.data = [<span>d</span>, [], <span>d</span>];
        break;
      case 6:
        this.data = [<span>d</span>, [<span>d</span>, 1], <span>d</span>];
        break;
      case 7:
        this.data = [<span>d</span>, [], <span>d</span>];
        break;
      case 8:
        this.data = [<span>d</span>, [1, 2, <span>d</span>], <span>d</span>];
        break;
      case 9:
        this.data = [<span>d</span>, [], <span>d</span>];
        break;
      case 10:
        this.data = [<span>d</span>, [<span>d</span>, <span>d</span>], <span>d</span>];
        break;
      case 11:
        this.data = [<span>d</span>, [], <span>d</span>];
        break;
      case 12:
        this.data = [<span>d</span>, [<span>d</span>, <span>d</span>, 1], <span>d</span>];
        break;
      case 13:
        this.data = [<span>d</span>, [], <span>d</span>];
        break;
      case 14:
        this.data = [<span>d</span>, [<span>d</span>, <span>d</span>, 1, <span>d</span>], <span>d</span>];
        break;
      case 15:
        this.data = [<span>d</span>, [], <span>d</span>];
        break;
      case 16:
        this.data = [<span>d</span>, [1, 2, <span>d</span>, 3], <span>d</span>];
        break;
      case 17:
        this.data = [<span>d</span>, [], <span>d</span>];
        break;
        break;
      case 18:
        this.data = [<span>d</span>, [1, 2, <span>d</span>, 3, <span>d</span>], <span>d</span>];
        break;
    }
    this.record();
  }
  render() {
    return <div>
      <p onClick={this.click}>click</p>
      <div>{this.data}</div>
      <p ref=""></p>
    </div>;
  }
}

migi.render(
  <Component/>,
  '#test'
);