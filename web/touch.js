define(function(require, exports, module){/**
 * Thanks to zepto-touch.js
 * https://github.com/madrobby/zepto/blob/master/src/touch.js
 */

var touchList = [];
var touch = {};
var lastTouch;
var swipeTimeout;
var longTapTimeout;
var longTapDelay = 750;
var gesture;

function swipeDirection(x1, x2, y1, y2) {
  return Math.abs(x1 - x2) >= Math.abs(y1 - y2)
    ? (x1 - x2 > 0 ? 'left' : 'right')
    : (y1 - y2 > 0 ? 'up' : 'down');
}

function longTap(e) {
  longTapTimeout = null;
  if(touch.last && touch.name == 'longtap') {
    touch.cb(e);
    touchList.forEach(function(touch) {
      if(touch.name == 'longtap') {
        touch.cb(e);
      }
    });
    touch = {};
    touchList = [];
  }
}

function cancelLongTap() {
  if(longTapTimeout) {
    clearTimeout(longTapTimeout);
  }
  longTapTimeout = null;
}

function cancelAll() {
  if(touchTimeout) {
    clearTimeout(touchTimeout);
  }
  if(tapTimeout){
    clearTimeout(tapTimeout);
  }
  if(swipeTimeout) {
    clearTimeout(swipeTimeout);
  }
  if(longTapTimeout) {
    clearTimeout(longTapTimeout);
  }
  touchTimeout = tapTimeout = swipeTimeout = longTapTimeout = null;
  touchList = [];
}

function isPrimaryTouch(event){
  return (event.pointerType == 'touch' || event.pointerType == event.MSPOINTER_TYPE_TOUCH)
    && event.isPrimary;
}

function isPointerEventType(e, type){
  return (e.type == 'pointer' + type || e.type.toLowerCase() == 'mspointer' + type);
}

var now;
var delta;
var deltaX = 0;
var deltaY = 0;
var firstTouch;
var _isPointerType;

var hasInitGlobal;

function initGlobal() {
  document.addEventListener('touchmove', onTouchMove);
  document.addEventListener('MSPointerMove', onTouchMove);
  document.addEventListener('pointermove', onTouchMove);

  document.addEventListener('touchend', onTouchEnd);
  document.addEventListener('MSPointerUp', onTouchEnd);
  document.addEventListener('pointerup', onTouchEnd);

  document.addEventListener('touchcancel', cancelAll);
  document.addEventListener('MSPointerCancel', cancelAll);
  document.addEventListener('pointercancel', cancelAll);

  window.addEventListener('onscroll', cancelAll);
}

function onTouchMove(e) {
  if((_isPointerType = isPointerEventType(e, 'move')) && !isPrimaryTouch(e)) {
    return;
  }
  firstTouch = _isPointerType ? e : e.touches[0];
  cancelLongTap();

  if(!touch.vd) {
    return;
  }
  touch.x2 = firstTouch.pageX;
  touch.y2 = firstTouch.pageY;

  deltaX += Math.abs(touch.x1 - touch.x2);
  deltaY += Math.abs(touch.y1 - touch.y2);
}

function onTouchEnd(e) {
  if((_isPointerType = isPointerEventType(e, 'up')) && !isPrimaryTouch(e)) {
    return;
  }
  cancelLongTap();

  if(!touch.vd) {
    return;
  }

  // swipe
  if((touch.x2 && Math.abs(touch.x1 - touch.x2) > 30)
    || (touch.y2 && Math.abs(touch.y1 - touch.y2) > 30)) {
    swipeTimeout = setTimeout(function() {
      var type = 'swipe' + (swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2));
      if(touch.name == 'swipe' || touch.name == type) {
        touch.cb(e);
      }
      touchList.forEach(function(touch) {
        if(touch.name == 'swipe' || touch.name == type) {
          touch.cb(e);
        }
      });
      touch = {};
      touchList = [];
    }, 0);
  }
  // normal tap
  else if('last' in touch) {
    // don't fire tap when delta position changed by more than 30 pixels,
    // for instance when moving to a point and back to origin
    if(deltaX < 30 && deltaY < 30) {
      // delay by one tick so we can cancel the 'tap' event if 'scroll' fires
      // ('tap' fires before 'scroll')
      tapTimeout = setTimeout(function() {
        // trigger double tap immediately
        if(touch.isDoubleTap && touch.vd == lastTouch.vd) {
          if(touch.name == 'doubletap') {
            touch.cb(e);
          }
          touchList.forEach(function(touch) {
            if(touch.name == 'doubletap') {
              touch.cb(e);
            }
          });
          touch = {};
          touchList = [];
        }
      }, 0);
    }
    else {
      touch = {};
      touchList = [];
    }
  }
  deltaX = deltaY = 0;
}

exports["default"]=function(vd, name, cb) {
  if(!hasInitGlobal) {
    hasInitGlobal = true;
    initGlobal();
  }

  var elem = vd.element;

  elem.addEventListener('touchstart', onTouchStart);
  elem.addEventListener('MSPointerDown', onTouchStart);
  elem.addEventListener('pointerdown', onTouchStart);

  function onTouchStart(e) {
    if((_isPointerType = isPointerEventType(e, 'down')) && !isPrimaryTouch(e)) {
      return;
    }
    //有可能组件内父子多个使用了手势，冒泡触发了多个
    if(touch.first) {
      touchList.push({
        vd:vd,
        name:name,
        cb:cb
      });
      return;
    }

    firstTouch = _isPointerType ? e : e.touches[0];
    if(e.touches && e.touches.length === 1 && touch.x2) {
      // Clear out touch movement data if we have it sticking around
      // This can occur if touchcancel doesn't fire due to preventDefault, etc.
      touch.x2 = undefined;
      touch.y2 = undefined;
    }
    now = Date.now();
    delta = now - (touch.last || now);

    touch = {
      vd:vd,
      name:name,
      cb:cb,
      first: true,
      x1: firstTouch.pageX,
      y1: firstTouch.pageY,
      last: now
    };
    lastTouch = touch;

    if(delta > 0 && delta <= 250) {
      touch.isDoubleTap = true;
    }
    longTapTimeout = setTimeout(function() {
      longTap(e);
    }, longTapDelay);
    // adds the current touch contact for IE gesture recognition
    if(gesture && _isPointerType) {
      gesture.addPointer(e.pointerId);
    }
  }
};});