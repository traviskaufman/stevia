var $__TypeError = TypeError, $__Object = Object, $__toObject = function(value) {
  if (value == null) throw $__TypeError();
  return $__Object(value);
}, $__spread = function() {
  var rv = [], k = 0;
  for (var i = 0; i < arguments.length; i++) {
    var value = $__toObject(arguments[i]);
    for (var j = 0; j < value.length; j++) {
      rv[k++] = value[j];
    }
  }
  return rv;
};
(function(global) {
  'use strict';
  var Reflect;
  var isCommonJS = false;
  var stevia;
  if (typeof module === 'object' && typeof module.exports === 'object') {
    isCommonJS = true;
    Reflect = require('harmony-reflect');
  } else {
    Reflect = global.Reflect;
  }
  if (typeof Reflect !== 'object' || Reflect === null) {
    throw new Error('harmony-reflect is required for stevia to work correctly');
  }
  var $__2 = Reflect, has = $__2.has, hasOwn = $__2.hasOwn;
  stevia = {
    ingredients: Object.create(null),
    sweeten: function(obj, sweetenFn) {
      for (var args = [], $__0 = 2; $__0 < arguments.length; $__0++) args[$__0 - 2] = arguments[$__0];
      var ingredient;
      if (typeof sweetenFn === 'string') {
        ingredient = sweetenFn;
        sweetenFn = stevia.ingredients[ingredient];
      } else if (typeof sweetenFn !== 'function') {
        throw new Error('(sweeten) Pass in either a string or a function as a ' + 'second argument');
      }
      if (typeof sweetenFn === 'function') {
        return mkProxy.apply(null, $__spread([obj, sweetenFn], args));
      }
      throw new Error('(sweeten) don\'t know how to sweeten with "' + ingredient + '"');
    }
  };
  function mkProxy(obj, fn) {
    for (var args = [], $__1 = 2; $__1 < arguments.length; $__1++) args[$__1 - 2] = arguments[$__1];
    return new Proxy(obj, {get: function(target, name) {
        if (has(target, name)) {
          if (typeof target[name] === 'function') {
            return target[name].bind(target);
          }
          return target[name];
        }
        return fn.apply(null, $__spread([obj], args))[name];
      }});
  }
  if (isCommonJS) {
    module.exports = stevia;
  } else {
    global.stevia = stevia;
  }
})(this);
