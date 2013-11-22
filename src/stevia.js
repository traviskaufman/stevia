// TODO: move to src/ dir add es6 build step and ES6 syntax
'use strict';

var r = require('harmony-reflect');

exports.sweeten = function(obj, sweetenFn) {

  if (typeof sweetenFn === 'function') {
    return mkProxy(obj, sweetenFn);
  }

  if (typeof sweetenFn !== 'string') {
    throw new Error(
        '(sweeten) Pass in either a string or a function as a ' +
        'second argument'
    );
  }

  if (r.hasOwn(exports.ingredients, sweetenFn)) {
    return mkProxy(obj, exports.ingredients[sweetenFn]);
  } else {
    throw new Error(
        '(sweeten) don\'t know how to sweeten with "' + sweetenFn + '"'
    );
  }

};

function mkProxy(obj, fn) {
  return new Proxy(obj, {
    get: function(target, name) {
      if (r.has(target, name)) return target[name];
      return fn(obj)[name];
    }
  });
}

exports.ingredients = Object.create(null);
