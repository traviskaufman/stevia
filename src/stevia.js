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
    throw new Error(
      'harmony-reflect is required for this stevia to work correctly'
    );
  }

  var { has, hasOwn } = Reflect;

  stevia = {
    ingredients: Object.create(null),
    sweeten(obj, sweetenFn, ...args) {

      var ingredient;

      if (typeof sweetenFn === 'string') {
        ingredient = sweetenFn;
        sweetenFn = stevia.ingredients[ingredient];
      } else if (typeof sweetenFn !== 'function') {
        throw new Error(
            '(sweeten) Pass in either a string or a function as a ' +
            'second argument'
        );
      }

      if (typeof sweetenFn === 'function') {
        return mkProxy(obj, sweetenFn, ...args);
      }

      throw new Error(
          '(sweeten) don\'t know how to sweeten with "' + ingredient + '"'
      );
    }
  };

  function mkProxy(obj, fn, ...args) {
    return new Proxy(obj, {
      get: function(target, name) {
        if (has(target, name)) {
          return target[name];
        }
        return fn(obj, ...args)[name];
      }
    });
  }

  if (isCommonJS) {
    module.exports = stevia;
  } else {
    global.stevia = stevia;
  }

})(this);
