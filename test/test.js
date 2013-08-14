var assert = require('assert');
var Promise = require('promise-now');
var anyFirst = require('..');
require('mocha-as-promised')();

describe('promise-any-first', function () {
	it("should fulfill if the first promise is fulfilled", function () {
		var p1 = new Promise().fulfill(1);
		var p2 = new Promise();
		return anyFirst([p1, p2]).then(function (value) {
			assert.equal(value, 1);
		});
	});

	it("should reject if all promises are rejected", function () {
		var p1 = new Promise().reject(1);
		var p2 = new Promise().reject(2);
		return anyFirst([p1, p2]).then(function () {
			throw new Error('should not be fulfilled');
		}, function (reason) {
			assert.equal(reason, 1);
		});
	});

	it("should fulfill if a promise is fulfilled and all precedings are rejected", function () {
		var p1 = new Promise();
		var p2 = new Promise();
		var p3 = new Promise();

		var p = anyFirst([p1, p2, p3]).then(function (value) {
			assert.equal(value, 3);
		});

		p2.reject(2);
		p1.reject(1);
		p3.fulfill(3);

		return p;
	});

	it("should fulfill if a promise is rejected and all precedings of a fulfilled promise are rejected", function () {
		var p1 = new Promise();
		var p2 = new Promise();
		var p3 = new Promise();

		var p = anyFirst([p1, p2, p3]).then(function (value) {
			assert.equal(value, 3);
		});

		p2.reject(2);
		p3.fulfill(3);
		p1.reject(1);

		return p;
	});

	it("should ignore rejected promises following a fulfilled promise", function () {
		var p1 = new Promise();
		var p2 = new Promise();
		var p3 = new Promise();
		var p4 = new Promise();

		var p = anyFirst([p1, p2, p3, p4]).then(function (value) {
			assert.equal(value, 3);
		});

		p2.reject(2);
		p3.fulfill(3);
		p1.reject(1);
		p1.reject(4);

		return p;
	});

	it("should ignore fulfilled promises following a fulfilled promise", function () {
		var p1 = new Promise();
		var p2 = new Promise();
		var p3 = new Promise();
		var p4 = new Promise();

		var p = anyFirst([p1, p2, p3, p4]).then(function (value) {
			assert.equal(value, 3);
		});

		p2.reject(2);
		p3.fulfill(3);
		p4.fulfill(4);
		p1.reject(1);

		return p;
	});

	it("should ignore a fulfilled promise if a preceding promise is fulfilled", function () {
		var p1 = new Promise();
		var p2 = new Promise();
		var p3 = new Promise();

		var p = anyFirst([p1, p2, p3]).then(function (value) {
			assert.equal(value, 2);
		});

		p3.fulfill(3);
		p2.fulfill(2);
		p1.reject(1);

		return p;
	});
});