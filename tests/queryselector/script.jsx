class Inner extends migi.Component {
  constructor(...data) {
    super(...data);
  }

  render() {
    return <strong>false</strong>;
  }
}
class Component extends migi.Component {
  constructor(...data) {
    super(...data);
    var p0 = this.find('#p0');
    if(p0) {
      p0.element.innerHTML = 'true';
    }
    this.on(migi.Event.DOM, function() {
      this.find('#p1').element.innerHTML = 'true';
      this.find('.p2').element.innerHTML = 'true';
      this.find('div').element.innerHTML = 'true';
      this.find('[test="p4"]').element.innerHTML = 'true';
      this.find('[Up]').element.innerHTML = 'true';
      this.find('Inner').element.innerHTML = 'true';
    });
  }

  render() {
    return <div>
      <p id="p0">false</p>
      <p id="p1">false</p>
      <p class="p2">false</p>
      <div>false</div>
      <p test="p4">false</p>
      <p Up="Up">false</p>
      <Inner/>
    </div>;
  }
}

var cp = new Component();
cp.inTo('#test');