class Test extends migi.Component {
  constructor(...data) {
    super(...data);
    this._cn = '';
    this.style = `a:hover{margin:1px}a:hover span{margin:2px}a:active{margin:3px}a:active span{margin:4px}`;
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
    return <div>
        <a href="#">123</a>
        <a href="#"><span>456</span></a>
      </div>;
  }
}

migi.render(
  <Test/>,
  '#test'
);