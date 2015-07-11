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
    this.$element.querySelector('[ref]').innerHTML = '^'
      + this.$element.querySelector('div').innerHTML.replace(/</g, '&lt;')
      + '$'
      + this.$element.querySelector('div').childNodes.length;
  }
  click() {
    switch(this.i++) {
      case 0:
        this.data = [1, [], 2];
        break;
      case 1:
        this.data = [1, [<span>d</span>], 2];
        break;
      case 2:
        this.data = [1, [], 2];
        break;
      case 3:
        this.data = [1, [1], 2];
        break;
      case 4:
        this.data = [1, [1, 2], 2];
        break;
      case 5:
        this.data = [1, [], 2];
        break;
      case 6:
        this.data = [1, [<span>d</span>, 1], 2];
        break;
      case 7:
        this.data = [1, [], 2];
        break;
      case 8:
        this.data = [1, [1, 2, <span>d</span>], 2];
        break;
      case 9:
        this.data = [1, [], 2];
        break;
      case 10:
        this.data = [1, [<span>d</span>, <span>d</span>], 2];
        break;
      case 11:
        this.data = [1, [], 2];
        break;
      case 12:
        this.data = [1, [<span>d</span>, <span>d</span>, 1], 2];
        break;
      case 13:
        this.data = [1, [], 2];
        break;
      case 14:
        this.data = [1, [<span>d</span>, <span>d</span>, 1, <span>d</span>], 2];
        break;
      case 15:
        this.data = [1, [], 2];
        break;
      case 16:
        this.data = [1, [1, 2, <span>d</span>, 3], 2];
        break;
      case 17:
        this.data = [1, [], 2];
        break;
        break;
      case 18:
        this.data = [1, [1, 2, <span>d</span>, 3, <span>d</span>], 2];
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