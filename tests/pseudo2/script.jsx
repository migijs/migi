class Test extends migi.Component {
  constructor(...data) {
    super(...data);
    this.style = `p{margin:10px;height:10px}p:empty{margin:20px}input{margin:99px}input:enabled{margin:100px}input:disabled{margin:101px}input:checked{margin:102px}`;
  }
  render() {
    return <div>
        <p/>
        <input id="i1"/>
        <input id="i2" disabled="disabled"/>
        <input type="checkbox" id="i3" checked="checked"/>
      </div>;
  }
}

migi.render(
  <Test/>,
  '#test'
);