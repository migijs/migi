class Test extends migi.Component {
  constructor(...data) {
    super(...data);
    this.style = `p{width:10px;height:10px}p:empty{width:20px}input{width:99px}input:enabled{width:100px}input:disabled{width:101px}input:checked{width:102px}`;
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