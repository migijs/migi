var _forEach = Function.call.bind(Array.prototype.forEach);
var _call = Function.call.bind(Function.call);
var _apply = Function.call.bind(Function.apply);
var _floor = Math.floor;
var _abs = Math.abs;
var _toString = Function.call.bind(Object.prototype.toString);

var isCallable = typeof /abc/ === 'function' ? function IsCallableSlow(x) {
  // Some old browsers (IE, FF) say that typeof /abc/ === 'function'
  return typeof x === 'function' && _toString(x) === '[object Function]';
} : function IsCallableFast(x) { return typeof x === 'function'; };

var ES = {
  Call: function Call(F, V) {
    var args = arguments.length > 2 ? arguments[2] : [];
    if (!ES.IsCallable(F)) {
      throw new TypeError(F + ' is not a function');
    }
    return _apply(F, V, args);
  },
  TypeIsObject: function (x) {
    if (x === void 0 || x === null || x === true || x === false) {
      return false;
    }
    return typeof x === 'function' || typeof x === 'object';
  },
  ToObject: function (o, optMessage) {
    return Object(ES.RequireObjectCoercible(o, optMessage));
  },
  IsCallable: isCallable,
  IsConstructor: function (x) {
    // We can't tell callables from constructors in ES5
    return ES.IsCallable(x);
  },
  GetMethod: function (o, p) {
    var func = ES.ToObject(o)[p];
    if (func === void 0 || func === null) {
      return void 0;
    }
    if (!ES.IsCallable(func)) {
      throw new TypeError('Method not callable: ' + p);
    }
    return func;
  },
  RequireObjectCoercible: function (x, optMessage) {
    /* jshint eqnull:true */
    if (x == null) {
      throw new TypeError(optMessage || 'Cannot call method on ' + x);
    }
    return x;
  },
  ToLength: function (value) {
    var len = ES.ToInteger(value);
    if (len <= 0) { return 0; } // includes converting -0 to +0
    if (len > Number.MAX_SAFE_INTEGER) { return Number.MAX_SAFE_INTEGER; }
    return len;
  },
  ToNumber: function (value) {
    if (_toString(value) === '[object Symbol]') {
      throw new TypeError('Cannot convert a Symbol value to a number');
    }
    return +value;
  },
  ToInteger: function (value) {
    var number = ES.ToNumber(value);
    if (numberIsNaN(number)) { return 0; }
    if (number === 0 || !numberIsFinite(number)) { return number; }
    return (number > 0 ? 1 : -1) * _floor(_abs(number));
  },
  GetIterator: function (o) {
    if (isArguments(o)) {
      // special case support for `arguments`
      return new ArrayIterator(o, 'value');
    }
    var itFn = ES.GetMethod(o, $iterator$);
    if (!ES.IsCallable(itFn)) {
      // Better diagnostics if itFn is null or undefined
      throw new TypeError('value is not an iterable');
    }
    var it = ES.Call(itFn, o);
    if (!ES.TypeIsObject(it)) {
      throw new TypeError('bad iterator');
    }
    return it;
  },
  IteratorClose: function (iterator, completionIsThrow) {
    var returnMethod = ES.GetMethod(iterator, 'return');
    if (returnMethod === void 0) {
      return;
    }
    var innerResult, innerException;
    try {
      innerResult = ES.Call(returnMethod, iterator);
    } catch (e) {
      innerException = e;
    }
    if (completionIsThrow) {
      return;
    }
    if (innerException) {
      throw innerException;
    }
    if (!ES.TypeIsObject(innerResult)) {
      throw new TypeError("Iterator's return method returned a non-object.");
    }
  },
  IteratorNext: function (it) {
    var result = arguments.length > 1 ? it.next(arguments[1]) : it.next();
    if (!ES.TypeIsObject(result)) {
      throw new TypeError('bad iterator');
    }
    return result;
  },
  IteratorStep: function (it) {
    var result = ES.IteratorNext(it);
    var done = ES.IteratorComplete(result);
    return done ? false : result;
  },
  IteratorComplete: function (iterResult) {
    return !!(iterResult.done);
  }
};

var getGlobal = function () {
  /* global self, window, global */
  // the only reliable means to get the global object is
  // `Function('return this')()`
  // However, this causes CSP violations in Chrome apps.
  if (typeof self !== 'undefined') { return self; }
  if (typeof window !== 'undefined') { return window; }
  if (typeof global !== 'undefined') { return global; }
  throw new Error('unable to locate global object');
};

var globals = getGlobal();

var globalIsFinite = globals.isFinite;

var numberIsNaN = Number.isNaN || function isNaN(value) {
    // NaN !== NaN, but they are identical.
    // NaNs are the only non-reflexive value, i.e., if x !== x,
    // then x is NaN.
    // isNaN is broken: it converts its argument to number, so
    // isNaN('foo') => true
    return value !== value;
  };
var numberIsFinite = Number.isFinite || function isFinite(value) {
    return typeof value === 'number' && globalIsFinite(value);
  };

var Type = {
  primitive: function (x) { return x === null || (typeof x !== 'function' && typeof x !== 'object'); },
  object: function (x) { return x !== null && typeof x === 'object'; },
  string: function (x) { return _toString(x) === '[object String]'; },
  regex: function (x) { return _toString(x) === '[object RegExp]'; },
  symbol: function (x) {
    return typeof globals.Symbol === 'function' && typeof x === 'symbol';
  }
};

var Symbol = globals.Symbol || {};

var $iterator$ = Type.symbol(Symbol.iterator) ? Symbol.iterator : '_es6-shim iterator_';
// Firefox ships a partial implementation using the name @@iterator.
// https://bugzilla.mozilla.org/show_bug.cgi?id=907077#c14
// So use that name if we detect it.
if (globals.Set && typeof new globals.Set()['@@iterator'] === 'function') {
  $iterator$ = '@@iterator';
}

function isArguments(value) {
  return _toString(value) === '[object Arguments]';
}

var ArrayShims = {
  from: function from(items) {
    var C = this;
    var mapFn = arguments.length > 1 ? arguments[1] : void 0;
    var mapping, T;
    if (mapFn === void 0) {
      mapping = false;
    } else {
      if (!ES.IsCallable(mapFn)) {
        throw new TypeError('Array.from: when provided, the second argument must be a function');
      }
      T = arguments.length > 2 ? arguments[2] : void 0;
      mapping = true;
    }

    // Note that that Arrays will use ArrayIterator:
    // https://bugs.ecmascript.org/show_bug.cgi?id=2416
    var usingIterator = typeof (isArguments(items) || ES.GetMethod(items, $iterator$)) !== 'undefined';

    var length, result, i;
    if (usingIterator) {
      result = ES.IsConstructor(C) ? Object(new C()) : [];
      var iterator = ES.GetIterator(items);
      var next, nextValue;

      i = 0;
      while (true) {
        next = ES.IteratorStep(iterator);
        if (next === false) {
          break;
        }
        nextValue = next.value;
        try {
          if (mapping) {
            nextValue = T === undefined ? mapFn(nextValue, i) : _call(mapFn, T, nextValue, i);
          }
          result[i] = nextValue;
        } catch (e) {
          ES.IteratorClose(iterator, true);
          throw e;
        }
        i += 1;
      }
      length = i;
    } else {
      var arrayLike = ES.ToObject(items);
      length = ES.ToLength(arrayLike.length);
      result = ES.IsConstructor(C) ? Object(new C(length)) : new Array(length);
      var value;
      for (i = 0; i < length; ++i) {
        value = arrayLike[i];
        if (mapping) {
          value = T !== undefined ? _call(mapFn, T, value, i) : mapFn(value, i);
        }
        result[i] = value;
      }
    }

    result.length = length;
    return result;
  }
};

var throwsError = function (func) {
  try {
    func();
    return false;
  } catch (e) {
    return true;
  }
};

var arePropertyDescriptorsSupported = function () {
  // if Object.defineProperty exists but throws, it's IE 8
  return !throwsError(function () { Object.defineProperty({}, 'x', { get: function () {} }); });
};

var supportsDescriptors = !!Object.defineProperty && arePropertyDescriptorsSupported();

var defineProperty = function (object, name, value, force) {
  if (!force && name in object) { return; }
  if (supportsDescriptors) {
    Object.defineProperty(object, name, {
      configurable: true,
      enumerable: false,
      writable: true,
      value: value
    });
  } else {
    object[name] = value;
  }
};

var defineProperties = function (object, map, forceOverride) {
  _forEach(Object.keys(map), function (name) {
    var method = map[name];
    defineProperty(object, name, method, !!forceOverride);
  });
};

defineProperties(Array, ArrayShims);

var maxSafeInteger = Math.pow(2, 53) - 1;

defineProperties(Number, {
  MAX_SAFE_INTEGER: maxSafeInteger,
  MIN_SAFE_INTEGER: -maxSafeInteger
});
