# promise-any-first

Take an array of promises, and return a promise that fulfills with the value of the first left-most fulfilled promise in the array, or rejects with reason of first rejected promise if all promises are rejected.

## Installation

	npm install promise-any-first

## Example

```javascript
var Promise = require('promise-now');
var anyFirst = require('promise-any-first')

var p1 = new Promise();
var p2 = new Promise();
var p3 = new Promise();

var promise = anyFirst([p1, p2, p3]).then(function (value) {
	console.log(value); // 2
});

p1.reject(1);
p3.fulfill(3);
p2.fulfill(2);
```