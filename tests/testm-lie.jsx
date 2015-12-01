var expect = require('expect.js');
var fs = require('fs');
var path = require('path');

require('./hack');
require('es6-shim');

var migi = require('../');
var lefty = require('lefty');
var jaw = require('jaw');

global.migi = migi;
migi.browser.lie = true;

describe('api', function() {
  it('global scope on window', function() {
    expect(window.migi).to.eql(migi);
  });
  it('#render', function() {
    expect(migi.render).to.be.a(Function);
  });
  it('#createCp', function() {
    expect(migi.createCp).to.be.a(Function);
  });
  it('#createVd', function() {
    expect(migi.createVd).to.be.a(Function);
  });
  it('#Event', function() {
    expect(migi.Event).to.be.a(Function);
  });
  it('#EventBus', function() {
    expect(migi.EventBus).to.be.a(Function);
  });
  it('#eventBus', function() {
    expect(migi.eventBus).to.be.a(Object);
  });
  it('#Element', function() {
    expect(migi.Element).to.be.a(Function);
  });
  it('#Component', function() {
    expect(migi.Component).to.be.a(Function);
  });
  it('#NonVisualComponent', function() {
    expect(migi.NonVisualComponent).to.be.a(Function);
  });
  it('#CacheComponent', function() {
    expect(migi.CacheComponent).to.be.a(Function);
  });
  it('#VirtualDom', function() {
    expect(migi.VirtualDom).to.be.a(Function);
  });
  it('#Obj', function() {
    expect(migi.Obj).to.be.a(Function);
  });
  it('#Cb', function() {
    expect(migi.Cb).to.be.a(Function);
  });
  it('#util', function() {
    expect(migi.util).to.be.a(Object);
  });
  it('#sort', function() {
    expect(migi.sort).to.be.a(Function);
  });
});

describe('Event', function() {
  it('on && emit', function() {
    var event = new migi.Event();
    var count = 0;
    event.on('name', function() {
      count++;
    });
    event.emit('name');
    expect(count).to.eql(1);
  });
  it('on data', function() {
    var event = new migi.Event();
    var count = [];
    event.on('name', function(a, b) {
      count = [a, b];
    });
    event.emit('name', 1, 2);
    expect(count).to.eql([1, 2]);
  });
  it('emit count', function() {
    var event = new migi.Event();
    var count = 0;
    event.on('name', function() {
      count++;
    });
    event.emit('name');
    event.emit('name');
    event.emit('name');
    event.emit('name');
    event.emit('name2');
    event.emit('name3');
    expect(count).to.eql(4);
  });
  it('off', function() {
    var event = new migi.Event();
    var count = 0;
    function cb() {
      count++;
    }
    event.on('name', cb);
    event.off('name', cb);
    event.emit('name');
    expect(count).to.eql(0);
  });
  it('off no ref', function() {
    var event = new migi.Event();
    var count = 0;
    event.on('name', function() {
      count++;
    });
    event.off('name', function() {
      count++;
    });
    event.emit('name');
    expect(count).to.eql(1);
  });
  it('off no param', function() {
    var event = new migi.Event();
    var count = 0;
    event.on('name', function() {
      count++;
    });
    event.off('name');
    event.emit('name');
    expect(count).to.eql(0);
  });
  it('off arguments', function() {
    var event = new migi.Event();
    var count = 0;
    event.on('name', function() {
      count++;
      event.off('name', arguments.callee);
    });
    event.emit('name');
    event.emit('name');
    event.emit('name');
    event.emit('name');
    expect(count).to.eql(1);
  });
  it('callback list is not altered during trigger', function() {
    var event = new migi.Event();
    var count = [0, 0, 0];
    function cb1() {
      count[1]++;
    }
    function cb2() {
      count[2]++;
    }
    event.on('name', function() {
      count[0]++;
      event.off('name');
    });
    event.on('name', cb1);
    event.on('name', cb2);
    event.emit('name');
    expect(count).to.eql([1, 1, 1]);
  });
  it('return self', function() {
    var event = new migi.Event();
    var count = 0;
    event.on('name', function() {
      count++;
    }).emit('name').off('name').emit('name');
    expect(count).to.eql(1);
  });
  it('on array', function() {
    var event = new migi.Event();
    var count = 0;
    event.on(['name', 'name2'], function() {
      count++;
    });
    event.emit('name');
    event.emit('name2');
    expect(count).to.eql(2);
  });
  it('emit array', function() {
    var event = new migi.Event();
    var count = 0;
    event.on('name', function() {
      count++;
    });
    event.on('name2', function() {
      count++;
    });
    event.emit(['name', 'name2']);
    expect(count).to.eql(2);
  });
  it('off array', function() {
    var event = new migi.Event();
    var count = 0;
    event.on('name', function() {
      count++;
    });
    event.on('name2', function() {
      count++;
    });
    event.off(['name', 'name2']);
    event.emit(['name', 'name2']);
    expect(count).to.eql(0);
  });
  it('once', function() {
    var event = new migi.Event();
    var count = 0;
    event.once('name', function() {
      count++;
    });
    event.emit('name');
    event.emit('name');
    event.emit('name');
    expect(count).to.eql(1);
  });
  it('once array but emit only 1', function() {
    var event = new migi.Event();
    var count = 0;
    event.once(['name', 'name2'], function() {
      count++;
    });
    event.emit('name');
    event.emit('name');
    event.emit('name');
    expect(count).to.eql(1);
  });
  it('once array', function() {
    var event = new migi.Event();
    var count = 0;
    event.once(['name', 'name2'], function() {
      count++;
    });
    event.emit('name');
    event.emit('name2');
    event.emit('name');
    event.emit('name2');
    expect(count).to.eql(2);
  });
  it('mix', function() {
    var event = {};
    migi.Event.mix(event);
    var count = 0;
    event.on('name', function() {
      count++;
    });
    event.emit('name');
    event.emit('name');
    event.off('name');
    event.emit('name');
    expect(count).to.eql(2);
  });
});

describe('VirtualDom', function() {
  beforeEach(function() {
    migi.Element.__clean();
  });
  it('instanceof', function() {
    var div = <div>123</div>;
    expect(div.__migiVD).to.be.a(migi.VirtualDom);
    expect(div.__migiEL).to.be.a(migi.Element);
  });
  it('name', function() {
    var div = <div>123</div>;
    expect(div.name).to.eql('div');
  });
  it('selfClose', function() {
    var img = <img src=""/>;
    expect(img.name).to.eql('img');
    var div = <div/>;
    expect(div.name).to.eql('div');
  });
  it('toString()', function() {
    var div = <div>123</div>;
    expect(div.toString()).to.eql('<div migi-uid="0">123</div>');
  });
  it('children', function() {
    var div = <div><span></span><span></span></div>;
    expect(div.children.length).to.eql(2);
  });
  it('variable', function() {
    var a = 1;
    var b = 2;
    var div = <div>{a} {b}</div>;
    expect(div.toString()).to.eql('<div migi-uid="0">12</div>');
  });
  it('blank between variable', function() {
    var a = 1;
    var div = <div>{a} 2</div>;
    expect(div.toString()).to.eql('<div migi-uid="0">1 2</div>');
  });
  it('className prop equal class', function() {
    var div = <div className="a">123</div>;
    expect(div.toString()).to.eql('<div class="a" migi-uid="0">123</div>');
  });
  it('parent', function() {
    var div = <div><span></span></div>;
    expect(div.children[0].parent).to.eql(div);
  });
  it('special prop', function() {
    var udf;
    var input = <input value={udf} checked={udf}/>;
    expect(input.toString()).to.eql('<input value="" migi-uid="0"/>');
  });
});

describe('Component', function() {
  class Component extends migi.Component {
    constructor(...data) {
      super(...data);
    }
    render() {
      return <div><span>123</span></div>;
    }
  }
  beforeEach(function() {
    migi.Element.__clean();
  });
  it('instanceof', function() {
    var cmpn = new Component();
    expect(cmpn.__migiCP).to.be.a(migi.Component);
    expect(cmpn.__migiEL).to.be.a(migi.Element);
  });
  it('name', function() {
    var cmpn = new Component();
    expect(cmpn.name).to.eql('Component');
  });
  it('toString()', function() {
    var cmpn = new Component();
    expect(cmpn.toString()).to.eql('<div migi-uid="2"><span migi-uid="1">123</span></div>');
  });
  it('virtualDom', function() {
    var cmpn = new Component();
    cmpn.toString();
    expect(cmpn.children.length).to.eql(0);
    expect(cmpn.virtualDom.__migiVD).to.be.a(migi.VirtualDom);
    expect(cmpn.virtualDom.name).to.eql('div');
    expect(cmpn.virtualDom.children.length).to.eql(1);
  });
  it('children', function() {
    var cmpn = new Component({}, [<span></span>]);
    cmpn.toString();
    expect(cmpn.children.length).to.eql(1);
    expect(cmpn.children[0].__migiVD).to.be.a(migi.VirtualDom);
    expect(cmpn.children[0].name).to.eql('span');
  });
  it('parent', function() {
    var cmpn = new Component();
    cmpn.toString();
    expect(cmpn.virtualDom.parent).to.eql(cmpn);
  });
  it('no overwrite render', function() {
    class Component extends migi.Component {
      constructor(...data) {
        super(...data);
      }
    }
    var cmpn = new Component({}, [<span></span>]);
    expect(cmpn.toString()).to.eql('<div migi-uid="2"><span migi-uid="0"></span></div>');
  });
  it('findChild', function() {
    var cmpn = new Component({}, [<span></span>]);
    cmpn.toString();
    expect(cmpn.findChild('span')).to.eql(cmpn.children[0]);
  });
  it('findChildren', function() {
    var cmpn = new Component({}, [<span></span>]);
    cmpn.toString();
    expect(cmpn.findChildren('span')).to.eql([cmpn.children[0]]);
  });
  it('special prop', function() {
    var udf;
    class Component extends migi.Component {
      constructor(...data) {
        super(...data);
      }
      render() {
        return <input value={this.udf} checked={this.udf} name={udf}/>;
      }
    }
    var cmpn = new Component();
    expect(cmpn.toString()).to.eql('<input value="" name="" migi-uid="1"/>');
  });
  it('parent2', function() {
    class Component extends migi.Component {
      constructor(...data) {
        super(...data);
      }
      render() {
        return <div><p><span>1</span></p></div>;
      }
    }
    var cmpn = new Component();
    cmpn.toString();
    var div = cmpn.virtualDom;
    var p = div.children[0];
    var span = p.children[0];
    expect(cmpn.parent).to.eql(null);
    expect(div.parent).to.eql(cmpn);
    expect(span.parent).to.eql(p);
    expect(p.parent).to.eql(div);
  });
  it('parent3', function() {
    class Component extends migi.Component {
      constructor(...data) {
        super(...data);
      }
      render() {
        return <div><Component2/></div>;
      }
    }
    class Component2 extends migi.Component {
      constructor(...data) {
        super(...data);
      }
      render() {
        return <p><span>1</span></p>;
      }
    }
    var cmpn = new Component();
    cmpn.toString();
    var div = cmpn.virtualDom;
    var cp2 = div.children[0];
    var p = cp2.virtualDom;
    var span = p.children[0];
    expect(cp2.parent).to.eql(div);
    expect(span.parent).to.eql(p);
    expect(p.parent).to.eql(cp2);
  });
  it('parent4', function() {
    class Component extends migi.Component {
      constructor(...data) {
        super(...data);
        this._v = [<span></span>];
      }
      get v() {
        return this._v;
      }
      set v(v) {
        this._v = v;
      }
      render() {
        return <div>{this.v}</div>;
      }
    }
    var cmpn = new Component();
    cmpn.toString();
    var div = cmpn.virtualDom;
    var span = div.children[0].v[0];
    expect(div.parent).to.eql(cmpn);
    expect(span.parent).to.eql(div);
  });
  it('top', function() {
    class Component extends migi.Component {
      constructor(...data) {
        super(...data);
      }
      render() {
        return <div><p><span>1</span></p></div>;
      }
    }
    var cmpn = new Component();
    cmpn.toString();
    var div = cmpn.virtualDom;
    var p = div.children[0];
    var span = p.children[0];
    expect(cmpn.top).to.eql(null);
    expect(div.top).to.eql(cmpn);
    expect(span.top).to.eql(cmpn);
    expect(p.top).to.eql(cmpn);
  });
  it('top2', function() {
    class Component extends migi.Component {
      constructor(...data) {
        super(...data);
      }
      render() {
        return <div><Component2/></div>;
      }
    }
    class Component2 extends migi.Component {
      constructor(...data) {
        super(...data);
      }
      render() {
        return <p><span>1</span></p>;
      }
    }
    var cmpn = new Component();
    cmpn.toString();
    var div = cmpn.virtualDom;
    var cp2 = div.children[0]
    var p = cp2.virtualDom;
    var span = p.children[0];
    expect(cp2.top).to.eql(cmpn);
    expect(span.top).to.eql(cp2);
    expect(p.top).to.eql(cp2);
  });
  it('top3', function() {
    class Component extends migi.Component {
      constructor(...data) {
        super(...data);
        this._v = [<span></span>];
      }
      get v() {
        return this._v;
      }
      set v(v) {
        this._v = v;
      }
      render() {
        return <div>{this.v}</div>;
      }
    }
    var cmpn = new Component();
    cmpn.toString();
    var div = cmpn.virtualDom;
    var span = div.children[0].v[0];
    expect(div.top).to.eql(cmpn);
    expect(span.top).to.eql(cmpn);
  });
  it('$', function() {
    class Component extends migi.Component {
      constructor(...data) {
        super(...data);
      }
      get v() {
        return this._v;
      }
      set v(v) {
        this._v = v;
      }
      render() {
        return <div/>;
      }
    }
    var cmpn = new Component();
    cmpn.toString();
    expect(cmpn.$.v).to.eql(undefined);
    cmpn.$.v = 1;
    expect(cmpn.$.v).to.eql(1);
  });
  it('$$', function() {
    class Component extends migi.Component {
      constructor(...data) {
        super(...data);
      }
      get v() {
        return this._v;
      }
      set v(v) {
        this._v = v;
      }
      render() {
        return <div/>;
      }
    }
    var cmpn = new Component();
    cmpn.toString();
    expect(cmpn.$$.v).to.eql(undefined);
    cmpn.$.v = 1;
    expect(cmpn.$$.v).to.eql(undefined);
  });
});

describe('css', function() {
  var style = `
    div{margin:0}
    div p{margin:1px}
    div p span{padding:0}
    .txt{padding:1px}
    strong.txt{font-weight:700;padding:2px}
    .txt{padding:3px}
    #sp{padding:4px}

    .toggle{margin:1px}
    .toggle p{margin:2px}
    .toggle strong{margin:0;padding:6px}
    .toggle .txt{padding:7px}
    .toggle #sp{padding:8px}
  `;
  beforeEach(function() {
    migi.Element.__clean();
  });
  it('simple', function() {
    class Component extends migi.Component {
      constructor(...data) {
        super(...data);
        this.style = style;
      }
      render() {
        return <div>123</div>;
      }
    }
    var cmpn = new Component();
    expect(cmpn.toString()).to.eql('<div style="margin:0;" migi-uid="1">123</div>');
  });
  it('class', function() {
    class Component extends migi.Component {
      constructor(...data) {
        super(...data);
        this.style = style;
      }
      render() {
        return <div class="toggle">123</div>;
      }
    }
    var cmpn = new Component();
    expect(cmpn.toString()).to.eql('<div migi-class="toggle" style="margin:0;margin:1px;" migi-uid="1">123</div>');
  });
  it('child', function() {
    class Component extends migi.Component {
      constructor(...data) {
        super(...data);
        this.style = style;
      }
      render() {
        return <div><p>123</p></div>;
      }
    }
    var cmpn = new Component();
    expect(cmpn.toString()).to.eql('<div style="margin:0;" migi-uid="2"><p style="margin:1px;" migi-uid="1">123</p></div>');
  });
  it('class child', function() {
    class Component extends migi.Component {
      constructor(...data) {
        super(...data);
        this.style = style;
      }
      render() {
        return <div class="toggle"><p>123</p></div>;
      }
    }
    var cmpn = new Component();
    expect(cmpn.toString()).to.eql('<div migi-class="toggle" style="margin:0;margin:1px;" migi-uid="2"><p style="margin:1px;margin:2px;" migi-uid="1">123</p></div>');
  });
  it('child recursion', function() {
    class Component extends migi.Component {
      constructor(...data) {
        super(...data);
        this.style = style;
      }
      render() {
        return <div><p><span>123</span></p></div>;
      }
    }
    var cmpn = new Component();
    expect(cmpn.toString()).to.eql('<div style="margin:0;" migi-uid="3"><p style="margin:1px;" migi-uid="2"><span style="padding:0;" migi-uid="1">123</span></p></div>');
  });
  it('class recursion', function() {
    class Component extends migi.Component {
      constructor(...data) {
        super(...data);
        this.style = style;
      }
      render() {
        return <div><p><span class="txt">123</span></p></div>;
      }
    }
    var cmpn = new Component();
    expect(cmpn.toString()).to.eql('<div style="margin:0;" migi-uid="3"><p style="margin:1px;" migi-uid="2"><span migi-class="txt" style="padding:0;padding:1px;padding:3px;" migi-uid="1">123</span></p></div>');
  });
  it('class child recursion', function() {
    class Component extends migi.Component {
      constructor(...data) {
        super(...data);
        this.style = style;
      }
      render() {
        return <div class="toggle"><p><span>123</span></p></div>;
      }
    }
    var cmpn = new Component();
    expect(cmpn.toString()).to.eql('<div migi-class="toggle" style="margin:0;margin:1px;" migi-uid="3"><p style="margin:1px;margin:2px;" migi-uid="2"><span style="padding:0;" migi-uid="1">123</span></p></div>');
  });
  it('long dom', function() {
    class Component extends migi.Component {
      constructor(...data) {
        super(...data);
        this.style = style;
      }
      render() {
        return <ol><li><h3><span class="txt">123</span></h3></li></ol>;
      }
    }
    var cmpn = new Component();
    expect(cmpn.toString()).to.eql('<ol migi-uid="4"><li migi-uid="3"><h3 migi-uid="2"><span migi-class="txt" style="padding:1px;padding:3px;" migi-uid="1">123</span></h3></li></ol>');
  });
  it('very long dom && nonsequence', function() {
    class Component extends migi.Component {
      constructor(...data) {
        super(...data);
        this.style = `span{margin:0}h3 span{padding:0}ol span{color:#FFF}ol p span{line-height:2}`;
      }
      render() {
        return <ol><li><h3><div><p><span>123</span></p></div></h3></li></ol>;
      }
    }
    var cmpn = new Component();
    expect(cmpn.toString()).to.eql('<ol migi-uid="6"><li migi-uid="5"><h3 migi-uid="4"><div migi-uid="3"><p migi-uid="2"><span style="margin:0;padding:0;color:#FFF;line-height:2;" migi-uid="1">123</span></p></div></h3></li></ol>');
  });
  it('long cascading', function() {
    class Component extends migi.Component {
      constructor(...data) {
        super(...data);
        this.style = `.txt{margin:0}.a .txt{padding:0}.a .b .txt{color:#FFF}`;
      }
      render() {
        return <span class="txt">123</span>;
      }
    }
    var cmpn = new Component();
    expect(cmpn.toString()).to.eql('<span migi-class="txt" style="margin:0;" migi-uid="1">123</span>');
  });
  it('multi', function() {
    class Component extends migi.Component {
      constructor(...data) {
        super(...data);
        this.style = `span{margin:0}p span{padding:0}div p span{color:#FFF}`;
      }
      render() {
        return <div><p><span>123</span></p></div>;
      }
    }
    var cmpn = new Component();
    expect(cmpn.toString()).to.eql('<div migi-uid="3"><p migi-uid="2"><span style="margin:0;padding:0;color:#FFF;" migi-uid="1">123</span></p></div>');
  });
  it('combo', function() {
    class Component extends migi.Component {
      constructor(...data) {
        super(...data);
        this.style = `.txt{margin:0}p span{padding:0}div p span{color:#FFF}`;
      }
      render() {
        return <div><p><span class="txt">123</span></p></div>;
      }
    }
    var cmpn = new Component();
    expect(cmpn.toString()).to.eql('<div migi-uid="3"><p migi-uid="2"><span migi-class="txt" style="padding:0;color:#FFF;margin:0;" migi-uid="1">123</span></p></div>');
  });
  it('#id', function() {
    class Component extends migi.Component {
      constructor(...data) {
        super(...data);
        this.style = `#sp{margin:0}p .txt{padding:0}`;
      }
      render() {
        return <p><span id="sp" class="txt">123</span></p>;
      }
    }
    var cmpn = new Component();
    expect(cmpn.toString()).to.eql('<p migi-uid="2"><span migi-id="sp" migi-class="txt" style="padding:0;margin:0;" migi-uid="1">123</span></p>');
  });
  it('nonsequence css', function() {
    class Component extends migi.Component {
      constructor(...data) {
        super(...data);
        this.style = style;
      }
      render() {
        return <div><span>123</span></div>;
      }
    }
    var cmpn = new Component();
    expect(cmpn.toString()).to.eql('<div style="margin:0;" migi-uid="2"><span migi-uid="1">123</span></div>');
  });
  it('nonsequence dom', function() {
    class Component extends migi.Component {
      constructor(...data) {
        super(...data);
        this.style = `div span{margin:0}`;
      }
      render() {
        return <div><p><span>123</span></p></div>;
      }
    }
    var cmpn = new Component();
    expect(cmpn.toString()).to.eql('<div migi-uid="3"><p migi-uid="2"><span style="margin:0;" migi-uid="1">123</span></p></div>');
  });
  it('both tag/class/id', function() {
    class Component extends migi.Component {
      constructor(...data) {
        super(...data);
        this.style = `div.d1#d2{margin:0}p#p2.p1{margin:1}span.s1#s2{margin:2}`;
      }
      render() {
        return <div class="d1" id="d2"><p class="p1" id="p2"><span class="s1" id="s2">123</span></p></div>;
      }
    }
    var cmpn = new Component();
    expect(cmpn.toString()).to.eql('<div migi-class="d1" migi-id="d2" style="margin:0;" migi-uid="3"><p migi-class="p1" migi-id="p2" style="margin:1;" migi-uid="2"><span migi-class="s1" migi-id="s2" style="margin:2;" migi-uid="1">123</span></p></div>');
  });
  it('complex', function() {
    class Component extends migi.Component {
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
            <p><span>txt</span></p>
            <p><span class="txt">txt</span></p>
            <span class="txt">txt</span>
            <strong class="txt">strong</strong>
            <span id="sp" class="txt">id</span>
          </div>
        );
      }
    }
    var cmpn = new Component();
    expect(cmpn.toString()).to.eql('<div migi-class="" style="margin:0;" migi-uid="9"><p style="margin:1px;" migi-uid="1">click</p><p style="margin:1px;" migi-uid="3"><span style="padding:0;" migi-uid="2">txt</span></p><p style="margin:1px;" migi-uid="5"><span migi-class="txt" style="padding:0;padding:1px;padding:3px;" migi-uid="4">txt</span></p><span migi-class="txt" style="padding:1px;padding:3px;" migi-uid="6">txt</span><strong migi-class="txt" style="padding:1px;padding:3px;font-weight:700;padding:2px;" migi-uid="7">strong</strong><span migi-id="sp" migi-class="txt" style="padding:1px;padding:3px;padding:4px;" migi-uid="8">id</span></div>');
  });
  it('complex 2', function() {
    class Component extends migi.Component {
      constructor(...data) {
        super(...data);
        this._cn = 'toggle';
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
            <p><span>txt</span></p>
            <p><span class="txt">txt</span></p>
            <span class="txt">txt</span>
            <strong class="txt">strong</strong>
            <span id="sp" class="txt">id</span>
          </div>
        );
      }
    }
    var cmpn = new Component();
    expect(cmpn.toString()).to.eql('<div migi-class="toggle" style="margin:0;margin:1px;" migi-uid="9"><p style="margin:1px;margin:2px;" migi-uid="1">click</p><p style="margin:1px;margin:2px;" migi-uid="3"><span style="padding:0;" migi-uid="2">txt</span></p><p style="margin:1px;margin:2px;" migi-uid="5"><span migi-class="txt" style="padding:0;padding:1px;padding:3px;padding:7px;" migi-uid="4">txt</span></p><span migi-class="txt" style="padding:1px;padding:3px;padding:7px;" migi-uid="6">txt</span><strong migi-class="txt" style="padding:1px;padding:3px;font-weight:700;padding:2px;padding:6px;margin:0;padding:7px;" migi-uid="7">strong</strong><span migi-id="sp" migi-class="txt" style="padding:1px;padding:3px;padding:7px;padding:4px;padding:8px;" migi-uid="8">id</span></div>');
  });
});

describe('pseudo', function() {
  beforeEach(function() {
    migi.Element.__clean();
  });
  it('first-child', function() {
    class Component extends migi.Component {
      constructor(...data) {
        super(...data);
        this.style = `div:first-child{color:#FFF}span:first-child{margin:0}div span:first-child{padding:0}.a:first-child{font-size:0}`;
      }
      render() {
        return <div><span class="a">1</span><span>2</span><span>3</span></div>;
      }
    }
    var cmpn = new Component();
    expect(cmpn.toString()).to.eql('<div style="color:#FFF;" migi-uid="4"><span migi-class="a" style="margin:0;padding:0;font-size:0;" migi-uid="1">1</span><span migi-uid="2">2</span><span migi-uid="3">3</span></div>');
  });
  it('last-child', function() {
    class Component extends migi.Component {
      constructor(...data) {
        super(...data);
        this.style = `div:last-child{color:#FFF}span:last-child{margin:0}div span:last-child{padding:0}.a:last-child{font-size:0}`;
      }
      render() {
        return <div><span>1</span><span>2</span><span class="a">3</span></div>;
      }
    }
    var cmpn = new Component();
    expect(cmpn.toString()).to.eql('<div style="color:#FFF;" migi-uid="4"><span migi-uid="1">1</span><span migi-uid="2">2</span><span migi-class="a" style="margin:0;padding:0;font-size:0;" migi-uid="3">3</span></div>');
  });
  it('*', function() {
    class Component extends migi.Component {
      constructor(...data) {
        super(...data);
        this.style = `*{margin:0}`;
      }
      render() {
        return <div><p><span>123</span></p></div>;
      }
    }
    var cmpn = new Component();
    expect(cmpn.toString()).to.eql('<div style="margin:0;" migi-uid="3"><p style="margin:0;" migi-uid="2"><span style="margin:0;" migi-uid="1">123</span></p></div>');
  });
  it('*.class', function() {
    class Component extends migi.Component {
      constructor(...data) {
        super(...data);
        this.style = `*.a{margin:0}`;
      }
      render() {
        return <div class="a"><p><span class="b">123</span></p></div>;
      }
    }
    var cmpn = new Component();
    expect(cmpn.toString()).to.eql('<div migi-class="a" style="margin:0;" migi-uid="3"><p migi-uid="2"><span migi-class="b" migi-uid="1">123</span></p></div>');
  });
  it('*#id', function() {
    class Component extends migi.Component {
      constructor(...data) {
        super(...data);
        this.style = `*#a{margin:0}`;
      }
      render() {
        return <div id="a"><p id="b"><span class="a">123</span></p></div>;
      }
    }
    var cmpn = new Component();
    expect(cmpn.toString()).to.eql('<div migi-id="a" style="margin:0;" migi-uid="3"><p migi-id="b" migi-uid="2"><span migi-class="a" migi-uid="1">123</span></p></div>');
  });
  it('nest *', function() {
    class Component extends migi.Component {
      constructor(...data) {
        super(...data);
        this.style = `div *{margin:0}div * span{padding:0}* p span{color:#F00}`;
      }
      render() {
        return <div><p><span>123</span></p></div>;
      }
    }
    var cmpn = new Component();
    expect(cmpn.toString()).to.eql('<div migi-uid="3"><p style="margin:0;" migi-uid="2"><span style="margin:0;padding:0;color:#F00;" migi-uid="1">123</span></p></div>');
  });
  it('undefined', function() {
    class Component extends migi.Component {
      constructor(...data) {
        super(...data);
        this.style = `div.undefined{margin:0}div#undefined{padding:0}`;
      }
      render() {
        return <div>123</div>;
      }
    }
    var cmpn = new Component();
    expect(cmpn.toString()).to.eql('<div migi-uid="1">123</div>');
  });
  it(':empty', function() {
    class Component extends migi.Component {
      constructor(...data) {
        super(...data);
        this.style = `p:empty{margin:0}`;
      }
      render() {
        return <div><p></p><p>{[]}</p><p>{}</p><p>1</p></div>;
      }
    }
    var cmpn = new Component();
    expect(cmpn.toString()).to.eql('<div migi-uid="5"><p style="margin:0;" migi-uid="1"></p><p style="margin:0;" migi-uid="2"></p><p style="margin:0;" migi-uid="3"></p><p migi-uid="4">1</p></div>');
  });
});

describe('relation', function() {
  beforeEach(function() {
    migi.Element.__clean();
  });
  it('>', function() {
    class Component extends migi.Component {
      constructor(...data) {
        super(...data);
        this.style = `div>p{margin:1px}p>span{padding:1px}div>span{color:#F00}div span{color:#0F0}`;
      }
      render() {
        return <div><p><span></span></p></div>;
      }
    }
    var cmpn = new Component();
    expect(cmpn.toString()).to.eql('<div migi-uid="3"><p style="margin:1px;" migi-uid="2"><span style="padding:1px;color:#0F0;" migi-uid="1"></span></p></div>');
  });
  it('+', function() {
    class Component extends migi.Component {
      constructor(...data) {
        super(...data);
        this.style = `p+span{margin:1px}p+p{padding:0}`;
      }
      render() {
        return <div><p><span>1</span></p><span>2</span><p>3</p><p>4</p></div>;
      }
    }
    var cmpn = new Component();
    expect(cmpn.toString()).to.eql('<div migi-uid="6"><p migi-uid="2"><span migi-uid="1">1</span></p><span style="margin:1px;" migi-uid="3">2</span><p migi-uid="4">3</p><p style="padding:0;" migi-uid="5">4</p></div>');
  });
  it('~', function() {
    class Component extends migi.Component {
      constructor(...data) {
        super(...data);
        this.style = `p~span{margin:1px}p~p{padding:0}`;
      }
      render() {
        return <div><p><span>1</span></p><span>2</span><p>3</p><p>4</p></div>;
      }
    }
    var cmpn = new Component();
    expect(cmpn.toString()).to.eql('<div migi-uid="6"><p migi-uid="2"><span migi-uid="1">1</span></p><span style="margin:1px;" migi-uid="3">2</span><p style="padding:0;" migi-uid="4">3</p><p style="padding:0;" migi-uid="5">4</p></div>');
  });
});

describe('attr', function() {
  beforeEach(function() {
    migi.Element.__clean();
  });
  it('novalue', function() {
    class Component extends migi.Component {
      constructor(...data) {
        super(...data);
        this.style = `div[title]{margin:0}`;
      }
      render() {
        return <div title="abc">1</div>;
      }
    }
    var cmpn = new Component();
    expect(cmpn.toString()).to.eql('<div title="abc" style="margin:0;" migi-uid="1">1</div>');
  });
  it('value', function() {
    class Component extends migi.Component {
      constructor(...data) {
        super(...data);
        this.style = `div[title="abc"]{margin:0}div[title="abd"]{padding:0}`;
      }
      render() {
        return <div title="abc">1</div>;
      }
    }
    var cmpn = new Component();
    expect(cmpn.toString()).to.eql('<div title="abc" style="margin:0;" migi-uid="1">1</div>');
  });
  it('^=', function() {
    class Component extends migi.Component {
      constructor(...data) {
        super(...data);
        this.style = `div[title^="abc"]{margin:0}div[title^="ab"]{padding:0}div[title^="ac"]{font-size:0}`;
      }
      render() {
        return <div title="abc">1</div>;
      }
    }
    var cmpn = new Component();
    expect(cmpn.toString()).to.eql('<div title="abc" style="margin:0;padding:0;" migi-uid="1">1</div>');
  });
  it('$=', function() {
    class Component extends migi.Component {
      constructor(...data) {
        super(...data);
        this.style = `div[title$="abc"]{margin:0}div[title$="bc"]{padding:0}div[title$="ab"]{font-size:0}`;
      }
      render() {
        return <div title="abc">1</div>;
      }
    }
    var cmpn = new Component();
    expect(cmpn.toString()).to.eql('<div title="abc" style="margin:0;padding:0;" migi-uid="1">1</div>');
  });
  it('~=', function() {
    class Component extends migi.Component {
      constructor(...data) {
        super(...data);
        this.style = `div[title~="abc"]{margin:0}div[title~="ab"]{padding:0}div[title~="abcd"]{font-size:0}`;
      }
      render() {
        return <div title="abc d">1</div>;
      }
    }
    var cmpn = new Component();
    expect(cmpn.toString()).to.eql('<div title="abc d" style="margin:0;" migi-uid="1">1</div>');
  });
  it('*=', function() {
    class Component extends migi.Component {
      constructor(...data) {
        super(...data);
        this.style = `div[title*="b"]{margin:0}div[title*="ab"]{padding:0}div[title*="ac"]{font-size:0}`;
      }
      render() {
        return <div title="abc">1</div>;
      }
    }
    var cmpn = new Component();
    expect(cmpn.toString()).to.eql('<div title="abc" style="margin:0;padding:0;" migi-uid="1">1</div>');
  });
  it('|=', function() {
    class Component extends migi.Component {
      constructor(...data) {
        super(...data);
        this.style = `div[title|="bc"]{margin:0}div[title|="abc"]{padding:0}div[title|="f"]{font-size:0}`;
      }
      render() {
        return <div title="abc-f">1</div>;
      }
    }
    var cmpn = new Component();
    expect(cmpn.toString()).to.eql('<div title="abc-f" style="padding:0;" migi-uid="1">1</div>');
  });
  it('depth', function() {
    class Component extends migi.Component {
      constructor(...data) {
        super(...data);
        this.style = `div p span[title]{margin:0}`;
      }
      render() {
        return <div><p><span title="a">1</span></p></div>;
      }
    }
    var cmpn = new Component();
    expect(cmpn.toString()).to.eql('<div migi-uid="3"><p migi-uid="2"><span title="a" style="margin:0;" migi-uid="1">1</span></p></div>');
  });
  it('with pseudo', function() {
    class Component extends migi.Component {
      constructor(...data) {
        super(...data);
        this.style = `div:first-child{margin:0}div[title]{padding:0}`;
      }
      render() {
        return <div title="a">1</div>;
      }
    }
    var cmpn = new Component();
    expect(cmpn.toString()).to.eql('<div title="a" style="margin:0;padding:0;" migi-uid="1">1</div>');
  });
});

describe('bridge', function() {
  class Component extends migi.Component {
    constructor(...data) {
      super(...data);
    }
    get a() {
      return this._a;
    }
    set a(v) {
      this._a = v;
    }
    render() {
      return <div>{this.a}</div>;
    }
  }
  it('(target, name)', function() {
    var c1 = new Component();
    var c2 = new Component();
    c1.bridge(c2, 'a');
    c1.a = 1;
    expect(c2.a).to.eql(1);
  });
  it('(target, name, name)', function() {
    var c1 = new Component();
    var c2 = new Component();
    c1.bridge(c2, 'a', 'a');
    c1.a = 1;
    expect(c2.a).to.eql(1);
  });
  it('(target, name, function)', function() {
    var c1 = new Component();
    var c2 = new Component();
    c1.bridge(c2, 'a', function(v) {
      return v + 1;
    });
    c1.a = 1;
    expect(c2.a).to.eql(2);
  });
  it('(target, name, name, function)', function() {
    var c1 = new Component();
    var c2 = new Component();
    c1.bridge(c2, 'a', 'a', function(v) {
      return v + 1;
    });
    c1.a = 1;
    expect(c2.a).to.eql(2);
  });
  it('(target, object<String:String>)', function() {
    var c1 = new Component();
    var c2 = new Component();
    c1.bridge(c2, {
      a: 'a'
    });
    c1.a = 1;
    expect(c2.a).to.eql(1);
  });
  it('(target, object<String:Function>)', function() {
    var c1 = new Component();
    var c2 = new Component();
    c1.bridge(c2, {
      a: function(v) {
        return v + 1;
      }
    });
    c1.a = 1;
    expect(c2.a).to.eql(2);
  });
  it('(target, object<String:Object<name:String,middleware:Function>>)', function() {
    var c1 = new Component();
    var c2 = new Component();
    c1.bridge(c2, {
      a: {
        name: 'a',
        middleware: function(v) {
          return v + 1;
        }
      }
    });
    c1.a = 1;
    expect(c2.a).to.eql(2);
  });
  it('duplicate', function() {
    var c1 = new Component();
    var c2 = new Component();
    c1.bridge(c2, 'a');
    expect(function() {
      c1.bridge(c2, 'a');
    }).to.throwError();
  });
});

describe('model bridge', function() {
  class Model extends migi.Model {
    constructor(...data) {
      super(...data);
    }
    get a() {
      return this._a;
    }
    set a(v) {
      this._a = v;
    }
  }
  it('(target, name)', function() {
    var c1 = new Model();
    var c2 = new Model();
    c1.bridge(c2, 'a');
    c1.a = 1;
    expect(c2.a).to.eql(1);
  });
  it('(target, name, name)', function() {
    var c1 = new Model();
    var c2 = new Model();
    c1.bridge(c2, 'a', 'a');
    c1.a = 1;
    expect(c2.a).to.eql(1);
  });
  it('(target, name, function)', function() {
    var c1 = new Model();
    var c2 = new Model();
    c1.bridge(c2, 'a', function(v) {
      return v + 1;
    });
    c1.a = 1;
    expect(c2.a).to.eql(2);
  });
  it('(target, name, name, function)', function() {
    var c1 = new Model();
    var c2 = new Model();
    c1.bridge(c2, 'a', 'a', function(v) {
      return v + 1;
    });
    c1.a = 1;
    expect(c2.a).to.eql(2);
  });
  it('(target, object<String:String>)', function() {
    var c1 = new Model();
    var c2 = new Model();
    c1.bridge(c2, {
      a: 'a'
    });
    c1.a = 1;
    expect(c2.a).to.eql(1);
  });
  it('(target, object<String:Function>)', function() {
    var c1 = new Model();
    var c2 = new Model();
    c1.bridge(c2, {
      a: function(v) {
        return v + 1;
      }
    });
    c1.a = 1;
    expect(c2.a).to.eql(2);
  });
  it('(target, object<String:Object<name:String,middleware:Function>>)', function() {
    var c1 = new Model();
    var c2 = new Model();
    c1.bridge(c2, {
      a: {
        name: 'a',
        middleware: function(v) {
          return v + 1;
        }
      }
    });
    c1.a = 1;
    expect(c2.a).to.eql(2);
  });
  it('duplicate', function() {
    var c1 = new Model();
    var c2 = new Model();
    c1.bridge(c2, 'a');
    expect(function() {
      c1.bridge(c2, 'a');
    }).to.throwError();
  });
});

describe('model bridge event', function() {
  class Model extends migi.Model {
    constructor(...data) {
      super(...data);
    }
    get a() {
      return this._a;
    }
    set a(v) {
      this._a = v;
    }
  }
  var eventBus = new migi.EventBus();
  it('(target, name)', function() {
    var c1 = new Model();
    var c2 = new Model();
    c1.bridge(eventBus, 'a');
    c2.bridgeTo(eventBus, 'a');
    c1.a = 1;
    expect(c2.a).to.eql(1);
  });
  it('(target, name, name)', function() {
    var c1 = new Model();
    var c2 = new Model();
    c1.bridge(eventBus, 'a', 'a');
    c2.bridgeTo(eventBus, 'a');
    c1.a = 1;
    expect(c2.a).to.eql(1);
  });
  it('(target, name, function)', function() {
    var c1 = new Model();
    var c2 = new Model();
    c1.bridge(eventBus, 'a', function(v) {
      return v + 1;
    });
    c2.bridgeTo(eventBus, 'a');
    c1.a = 1;
    expect(c2.a).to.eql(2);
  });
  it('(target, name, name, function)', function() {
    var c1 = new Model();
    var c2 = new Model();
    c1.bridge(eventBus, 'a', 'a', function(v) {
      return v + 1;
    });
    c2.bridgeTo(eventBus, 'a');
    c1.a = 1;
    expect(c2.a).to.eql(2);
  });
  it('(target, object<String:String>)', function() {
    var c1 = new Model();
    var c2 = new Model();
    c1.bridge(eventBus, {
      a: 'a'
    });
    c2.bridgeTo(eventBus, 'a');
    c1.a = 1;
    expect(c2.a).to.eql(1);
  });
  it('(target, object<String:Function>)', function() {
    var c1 = new Model();
    var c2 = new Model();
    c1.bridge(eventBus, {
      a: function(v) {
        return v + 1;
      }
    });
    c2.bridgeTo(eventBus, 'a');
    c1.a = 1;
    expect(c2.a).to.eql(2);
  });
  it('(target, object<String:Object<name:String,middleware:Function>>)', function() {
    var c1 = new Model();
    var c2 = new Model();
    c1.bridge(eventBus, {
      a: {
        name: 'a',
        middleware: function(v) {
          return v + 1;
        }
      }
    });
    c2.bridgeTo(eventBus, 'a');
    c1.a = 1;
    expect(c2.a).to.eql(2);
  });
  it('duplicate', function() {
    var c1 = new Model();
    var c2 = new Model();
    c1.bridge(eventBus, 'a');
    expect(function() {
      c1.bridge(eventBus, 'a');
    }).to.throwError();
  });
});