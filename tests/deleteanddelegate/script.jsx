class Component extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.list = [1];
  }
  @bind list
  del() {
    this.list.pop();
  }
  render() {
    return <ul onClick={ { b: this.del, 'span': this.click } }>
      {
        (this.list || []).map(() => {
          return <li>
            <span>name</span>
            <b>del</b>
          </li>;
        })
      }
    </ul>;
  }
}

migi.render(
  <Component/>,
  '#test'
);

window.onerror = function() {
  document.querySelector('#test2').innerHTML = 'yes';
};
