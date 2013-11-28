# stevia: Natural sweetener for Javascript Objects

  Stevia is an experimental module that provides natural sweetening for javascript objects. It can be used to add functionality to existing objects in an elegant, safe, and versatile way.

## What do you mean "natural sweetening"?
Imagine you're working with a module that does something like this:

```javascript
module.doSomethingWithElement = function(el) {
  // Do some stuff...
  document.body.appendChild(el);
}
```

Now imagine you want to use this method, but you're also working with jQuery
and therefore all the elements you work with in *your* code are in the form of
jQuery objects. This is great because as is obvious jQuery makes a lot of DOM
operations trivial, but it also means that in order to work with the above
module, you have to do something like

```javascript
module.doSomethingWithElement($el.get(0));
```
This is kind of a pain, and it means that you constantly have to unwrap
elements whenever you want to use this module's api. What's more is that maybe
you *also* want to work with the plain element in your code sometimes, in which
case you have to unwrap it and then what's the point of initially using the
jQuery wrapper in the first place?

stevia allows you to do something like this:
```javascript
var $el = stevia.sweeten(document.querySelector('.element'), function(el) {
  return $(el);
});

$el.addClass('foo'); // This will work
module.doSomethingWithElement($el); // This will also work
```

In the example above, a plain DOM element is passed in as the first argument to
`stevia.sweeten`, and a function as the second argument which takes an object
and returns a jQuery object which wraps its argument. The returned value
`$el` looks, feels, and acts like a plain DOM element. However, when a jQuery
method is called on it, it will be able to respond to it as if it were a jQuery
object, even though _nothing_ seems to have changed with respect to the
original object passed in. This is the meaning of "naturally" sweeten; using
this method one can extend objects in such a way that it can function as if it
were extended yet still be consumed by APIs that expect it to act like it's not
extended.

Here's another example of naturally sweetening an object using
[lodash](http://lodash.com)
```javascript
var a = stevia.sweeten({foo: 'bar', baz: 'bing'}, function(o) {
  return _(o)
});

console.log(JSON.stringify(o)); // '{"foo":"bar","baz":"bing"}'
console.log(o.values().tail().value()); // ['bing']
```

You can also add functions to the `stevia.ingredients` object, and then pass in string identifiers
to `stevia.sweeten` which will use the function corresponding to the property name on
`stevia.ingredients`. Here's an example of doing this with Dates and the amazing
[momentjs](http://momentjs.com/) library.

```javascript
var date, amazingDate;

stevia.ingredients.moment = function(date) {
	var klass = Object.prototype.toString.call(date).slice(8, -1);
	if (klass !== 'Date') {
		throw new Error('need a Date instance and you gave me a ' + klass);
	}
	return moment(date);
};

amazingDate = stevia.sweeten(new Date('Wed Nov 27 2013 18:28:31 GMT-0500 (EST)'), 'moment');
console.log(amazingDate.getHours()); // 27
console.log(amazingDate.format('DD/MM/YYYY')); // 27/11/2013
```

## Installation
```sh
npm install stevia
```

## This is an experimental module
This module relies on [ES6 Proxies](http://wiki.ecmascript.org/doku.php?id=harmony:direct_proxies)
and the [ES6 Reflect API](http://wiki.ecmascript.org/doku.php?id=harmony:reflect_api) in order to
function correctly.

In NodeJS, you can simply run `node --harmony`, and the
module should work. In CommonJS environments the module internally requires `harmony-reflect` so
you don't have to worry about including it yourself.

You can check [Kangax's Compatibility Table](http://kangax.github.io/es5-compat-table/es6/)
to see if the browser you're using supports proxies (note that in chrome you have to make sure you
enable experimental javascript on the `chrome://flags` page).

In addition, you also need to provide the harmony-reflect api within browsers. You can use
[Tom Van Cutsem's Shim](https://github.com/tvcutsem/harmony-reflect) for this. A nice side-effect
to this is that it allows direct proxies to be used in Chrome, meaning that this module will work
in Chrome even though older versions use the old-style proxies.

## Known Issues
Methods on Native objects currently have to be bound to that object as a receiver. This is the only
way that this can work on objects like DOM Elements and Dates, which will complain if the receiver
is not an instance of that constructor. Hopefully I can get rid of this once `invoke()` gets
implemented, but in the meantime any suggestions by way of issues or pull requests would be awesome.

## Feedback!
This module is an experimental idea. I'd love to get some feedback on it good, bad, otherwise. Open
up an issue or submit a PR!

## License

(The MIT License)

Copyright (c) 2013 Travis Kaufman &lt;travis.kaufman@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
