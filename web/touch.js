define(function(require, exports, module){/**
 * Thanks to zepto-touch.js
 * https://github.com/madrobby/zepto/blob/master/src/touch.js
 */

var touchList = [];
var touch = {};
var lastTouch;
var tapTimeout;
var swipeTimeout;
var longTapDelay = 750;
var lastTime = 0;
var gesture;
var now;
var delta;
var deltaX = 0;
var deltaY = 0;
var firstTouch;
var _isPointerType;

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
  if(tapTimeout){
    clearTimeout(tapTimeout);
  }
  if(swipeTimeout) {
    clearTimeout(swipeTimeout);
  }
  tapTimeout = swipeTimeout = null;
  touch = {};
  touchList = [];
}

function isPrimaryTouch(event){
  return (event.pointerType == 'touch' || event.pointerType == event.MSPOINTER_TYPE_TOUCH)
    && event.isPrimary;
}

function isPointerEventType(e, type){
  return (e.type == 'pointer' + type || e.type.toLowerCase() == 'mspointer' + type);
}

var hasInitGlobal;

function initGlobal() {
  document.addEventListener('touchmove', onTouchMove, true);
  document.addEventListener('MSPointerMove', onTouchMove, true);
  document.addEventListener('pointermove', onTouchMove, true);

  document.addEventListener('touchend', onTouchEnd, true);
  document.addEventListener('MSPointerUp', onTouchEnd, true);
  document.addEventListener('pointerup', onTouchEnd, true);
  document.addEventListener('MSGestureEnd', onGestureEnd, true);

  document.addEventListener('touchcancel', cancelAll, true);
  document.addEventListener('MSPointerCancel', cancelAll, true);
  document.addEventListener('pointercancel', cancelAll, true);

  window.addEventListener('onscroll', cancelAll);
}

function onTouchMove(e) {
  if(!touch.vd) {
    return;
  }
  if((_isPointerType = isPointerEventType(e, 'move')) && !isPrimaryTouch(e)) {
    return;
  }

  firstTouch = _isPointerType ? e : e.touches[0];
  touch.x2 = firstTouch.pageX;
  touch.y2 = firstTouch.pageY;

  deltaX += Math.abs(touch.x1 - touch.x2);
  deltaY += Math.abs(touch.y1 - touch.y2);
}

function onGestureEnd(e) {
  if(!touch.vd) {
    return;
  }

  var type = e.velocityX > 1 ? 'right' : e.velocityX < -1 ? 'left' : e.velocityY > 1 ? 'down' : e.velocityY < -1 ? 'up' : null;
  if(type) {
    if(touch.name == 'swipe' || touch.name == type) {
      touch.cb(e);
    }
    touchList.forEach(function(touch) {
      if(touch.name == 'swipe' || touch.name == type) {
        touch.cb(e);
      }
    });
  }
}

function onTouchEnd(e) {
  if(!touch.vd) {
    return;
  }
  if((_isPointerType = isPointerEventType(e, 'up')) && !isPrimaryTouch(e)) {
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
  // don't fire tap when delta position changed by more than 30 pixels,
  // for instance when moving to a point and back to origin
  else if(deltaX < 30 && deltaY < 30) {
    tapTimeout = setTimeout(function() {
      var isLongTap = (Date.now() - lastTime) > longTapDelay;
      if(isLongTap) {
        if(touch.name == 'longtap') {
          touch.cb(e);
        }
        touchList.forEach(function(touch) {
          if(touch.name == 'longtap') {
            touch.cb(e);
          }
        });
      }
      // trigger double tap immediately
      else if(touch.isDoubleTap && touch.vd == lastTouch.vd) {
        if(touch.name == 'doubletap') {
          touch.cb(e);
        }
        touchList.forEach(function(touch) {
          if(touch.name == 'doubletap') {
            touch.cb(e);
          }
        });
      }
      touch = {};
      touchList = [];
    }, 0);
  }
  else {
    touch = {};
    touchList = [];
  }
  deltaX = deltaY = 0;
}

exports["default"]=function(vd, name, cb, listener) {
  if(!hasInitGlobal) {
    hasInitGlobal = true;
    initGlobal();
  }
  listener.push('touchstart', onTouchStart);
  listener.push('MSPointerDown', onTouchStart);
  listener.push('pointerdown', onTouchStart);

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

    touch = {
      vd:vd,
      name:name,
      cb:cb,
      first: true,
      x1: firstTouch.pageX,
      y1: firstTouch.pageY
    };
    lastTouch = touch;

    now = Date.now();
    delta = now - lastTime;
    lastTime = now;
    if(delta > 0 && delta < 250) {
      touch.isDoubleTap = true;
    }

    // adds the current touch contact for IE gesture recognition
    if(gesture && _isPointerType) {
      gesture.addPointer(e.pointerId);
    }
  }
};});