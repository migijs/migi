var expect = require('expect.js');
var fs = require('fs');
var path = require('path');

require('./hack');
require('es6-shim');

var migi = require('../');
var lefty = require('lefty');
var jaw = require('jaw');

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
    migi.Element.clean();
  });
  it('instanceof', function() {
    var div = <div>123</div>;
    expect(div).to.be.a(migi.VirtualDom);
    expect(div).to.be.a(migi.Element);
    expect(div).to.be.a(migi.Event);
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
  it('find', function() {
    var div = <div><span></span></div>;
    expect(div.find('span')).to.eql(div.children[0]);
  });
  it('find All', function() {
    var div = <div><span></span></div>;
    expect(div.findAll('span')).to.eql([div.children[0]]);
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
    migi.Element.clean();
  });
  it('instanceof', function() {
    var cmpn = new Component();
    expect(cmpn).to.be.a(migi.Component);
    expect(cmpn).to.be.a(migi.Element);
    expect(cmpn).to.be.a(migi.Event);
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
    expect(cmpn.virtualDom).to.be.a(migi.VirtualDom);
    expect(cmpn.virtualDom.name).to.eql('div');
    expect(cmpn.virtualDom.children.length).to.eql(1);
  });
  it('children', function() {
    var cmpn = new Component({}, [<span></span>]);
    cmpn.toString();
    expect(cmpn.children.length).to.eql(1);
    expect(cmpn.children[0]).to.be.a(migi.VirtualDom);
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
  it('find', function() {
    var cmpn = new Component();
    cmpn.toString();
    expect(cmpn.find('span')).to.eql(cmpn.virtualDom.children[0]);
  });
  it('find All', function() {
    var cmpn = new Component();
    cmpn.toString();
    expect(cmpn.findAll('span')).to.eql([cmpn.virtualDom.children[0]]);
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
});