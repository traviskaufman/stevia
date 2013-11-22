'use strict';

var stevia = require(BASE_DIR + '/lib/stevia');

describe('stevia', function() { 

  var dude, fn;

  beforeEach(function() {
    dude = {
      dude: 'dude!'
    };
    
    fn = function(o) {
      return {
        sweet: function() { 
          return  o.dude + ' SWEET!'; 
        }
      };
    };
  });

  describe('#sweeten', function() {

    var sweet, realSweet;
    
    beforeEach(function() {
      sweet = stevia.sweeten(dude, fn);  
      realSweet = fn({
        dude: 'dude!'
      });
    });

    describe('basic usage', function() {

      it('takes an argument along with middleware that wraps the arg and ' +
         'augments it with functions', function() {
        assert.strictEqual(sweet.sweet(), realSweet.sweet());
      });

      it('passes along any additional parameters as positional args ' + 
         'to the middleware', function() {
        var middleware = sinon.spy();
        var arg1 = {}, arg2 = 'hello';
        stevia.sweeten(dude, middleware, arg1, arg2);
        sinon.assert.calledWithExactly(middleware, dude, arg1, arg2);
      });

      it('treats the enhanced object as if it\'s not wrapped', function() {
        assert.deepEqual(Object.keys(sweet), Object.keys(dude));
      });

      it('stringifies the object as if it\'s not wrapped', function() {
        assert.strictEqual(JSON.stringify(sweet), JSON.stringify(dude));
      });

      it('throws if you don\'t give it either a string or a function as ' +
         'its second arg', function() {
        assert.throws(function() {
          stevia.sweeten(dude, {});
        }, Error, '(sweeten) Pass in either a string or a function as a ' +
                  'second argument'
        );
      });

    });

    describe('sweetening with predefined middleware ("ingredients")', 
             function() {
      
      function DudeMonad(o) {
        this._wrapped = o;
      }
      
      DudeMonad.prototype.reduce = function(collector, initial, ctx) {
        var pieces = this._wrapped.dude.split('');
        var i, piece;
        /* jshint -W084 */
        for (i = 0; piece = pieces[i]; i++) {
          initial = collector.call(ctx, initial, piece);
        }

        return initial;
      };

      DudeMonad.prototype.any = function(iterator, ctx) {
        return this.reduce(function(bool, p) {
          return Boolean(bool || iterator.call(ctx, p));
        }, false, ctx); 
      };

      beforeEach(function() {
        stevia.ingredients.dudeMonads = function(o) {
          return new DudeMonad(o);
        };
      });

      it('uses stevia.ingredients[arg] function to sweeten if the second ' +
         'arg is a string', function() {
        assert.isTrue(
          stevia.sweeten(dude, 'dudeMonads').any(function(char) { 
            return char === '!'; 
          })
        );
      });

      it('throws if you don\'t give it a string it recognize', function() {
        assert.throws(function() {
          stevia.sweeten(dude, 'foo');
        }, Error, '(sweeten) don\'t know how to sweeten with "foo"');
      });

    });

    describe('property name conflict resolution', function() {

      beforeEach(function() {
        dude.sweet = 'uh-oh';
        sweet = stevia.sweeten(dude, function() {
          var sweeter = fn(dude);
          sweeter.toString = function() { return 'SUHWEEEEEET'; };
          return sweeter;
        });
      });

      it('honors properties on the original object over the wrapped ' +
         'object', function() {
        assert.strictEqual(sweet.sweet, dude.sweet);
      });

      it('honors properties on the original object\'s prototype over ' +
         'the wrapped object', function() {
        assert.strictEqual(sweet.toString(), dude.toString());
      });

    });

  }); 

});
