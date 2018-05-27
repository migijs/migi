define(function(require, exports, module){'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (vd, name, cb, listener) {
  if (!hasInitGlobal) {
    hasInitGlobal = true;
    initGlobal();
  }
  listener.push(['touchstart', onTouchStart]);

  var elem = vd.element;

  elem.addEventListener('touchstart', onTouchStart);

  function onTouchStart(e) {
    // 有可能组件内父子多个使用了手势，冒泡触发了多个
    if (touch.first) {
      touchList.push({
        vd: vd,
        name: name,
        cb: cb
      });
      return;
    }

    firstTouch = e.touches[0];
    if (e.touches && e.touches.length === 1 && touch.x2) {
      // Clear out touch movement data if we have it sticking around
      // This can occur if touchcancel doesn't fire due to preventDefault, etc.
      touch.x2 = undefined;
      touch.y2 = undefined;
    }

    touch = {
      vd: vd,
      name: name,
      cb: cb,
      first: true,
      x1: firstTouch.pageX,
      y1: firstTouch.pageY
    };
    lastTouch = touch;

    now = Date.now();
    delta = now - lastTime;
    lastTime = now;
    if (delta > 0 && delta < 250) {
      touch.isDoubleTap = true;
    }
  }
};

/**
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
var now;
var delta;
var deltaX = 0;
var deltaY = 0;
var firstTouch;

function swipeDirection(x1, x2, y1, y2) {
  return Math.abs(x1 - x2) >= Math.abs(y1 - y2) ? x1 - x2 > 0 ? 'left' : 'right' : y1 - y2 > 0 ? 'up' : 'down';
}

function cancelAll() {
  if (tapTimeout) {
    clearTimeout(tapTimeout);
  }
  if (swipeTimeout) {
    clearTimeout(swipeTimeout);
  }
  tapTimeout = swipeTimeout = null;
  touch = {};
  touchList = [];
}

var hasInitGlobal;

function initGlobal() {
  document.addEventListener('touchmove', onTouchMove, true);
  document.addEventListener('touchend', onTouchEnd, true);
  document.addEventListener('touchcancel', cancelAll, true);

  window.addEventListener('scroll', cancelAll);
  window.addEventListener('blur', cancelAll);
}

function onTouchMove(e) {
  if (!touch.vd) {
    return;
  }

  firstTouch = e.touches[0];
  touch.x2 = firstTouch.pageX;
  touch.y2 = firstTouch.pageY;

  deltaX += Math.abs(touch.x1 - touch.x2);
  deltaY += Math.abs(touch.y1 - touch.y2);
}

function onTouchEnd(e) {
  if (!touch.vd) {
    return;
  }

  // swipe
  if (touch.x2 && Math.abs(touch.x1 - touch.x2) > 30 || touch.y2 && Math.abs(touch.y1 - touch.y2) > 30) {
    swipeTimeout = setTimeout(function () {
      var type = 'swipe' + swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2);
      if (touch.name == 'swipe' || touch.name == type) {
        touch.cb(e);
      }
      touchList.forEach(function (touch) {
        if (touch.name == 'swipe' || touch.name == type) {
          touch.cb(e);
        }
      });
      touch = {};
      touchList = [];
    }, 0);
  }
  // don't fire tap when delta position changed by more than 30 pixels,
  // for instance when moving to a point and back to origin
  else if (deltaX < 30 && deltaY < 30) {
      tapTimeout = setTimeout(function () {
        var isLongTap = Date.now() - lastTime > longTapDelay;
        if (isLongTap) {
          if (touch.name == 'longtap') {
            touch.cb(e);
          }
          touchList.forEach(function (touch) {
            if (touch.name == 'longtap') {
              touch.cb(e);
            }
          });
        }
        // trigger double tap immediately
        else if (touch.isDoubleTap && touch.vd == lastTouch.vd) {
            if (touch.name == 'doubletap') {
              touch.cb(e);
            }
            touchList.forEach(function (touch) {
              if (touch.name == 'doubletap') {
                touch.cb(e);
              }
            });
          }
        touch = {};
        touchList = [];
      }, 0);
    } else {
      touch = {};
      touchList = [];
    }
  deltaX = deltaY = 0;
}

;});