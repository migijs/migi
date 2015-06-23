var style = `
  div{margin:0}
  div p{margin:1px}
  div p span{padding:0}
  .txt{padding:1px}
  strong.txt{font-size:12px;padding:2px}
  .txt{padding:3px}
  #sp{padding:4px}

  .toggle{margin:1px}
  .toggle p{margin:2px}
  .toggle p span{padding:1px}
  .toggle strong{margin:0;padding:6px}
  .toggle .txt{padding:7px}
  .toggle #sp{padding:8px}
`;


class Test extends migi.Component {
  constructor(...data) {
    super(...data);
    this._cn = '';
    this.style = style;
  }
  get cn() {
    return this._cn;
  }
  set cn(v) {
    this._cn = 'toggle';
  }
  click() {
    this.cn = 'toggle';
  }
  render() {
    return (
      <div class={this.cn}>
        <p onClick={this.click}>click</p>
        <p><span>text</span></p>
        <span class="txt">txt</span>
        <strong class="txt">strong</strong>
        <span id="sp" class="txt">id</span>
      </div>
    );
  }
}

migi.render(
  <Test/>,
  '#test'
);