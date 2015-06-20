var expect = require('expect.js');
var fs = require('fs');
var path = require('path');

require('./hack');

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