class Component extends migi.CacheComponent {
  constructor(...data) {
    super(...data);
    this.style = `li a{margin:0}li a:hover{margin:1px}li span{padding:0}`;
    this._list = [<a href="#">1</a>, <span>2</span>];
  }
  get list() {
    return this._list;
  }
  @bind
  set list(v) {
    this._list = v;
  }
  render() {
    return <ul>
      {
        this.list.map(function(item) {
          return <li>{ item }</li>;
        })
      }
    </ul>;
  }
}

var vd = migi.render(
  <Component/>,
  '#test'
);

window.onerror = function() {
  document.querySelector('#test2').innerHTML = 1;
};

vd.list = [<span>3</span>, <a href="#">4</a>];
vd.list = [<a href="#">1</a>, <span>2</span>];