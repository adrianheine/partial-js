"use strict";

var partial = require('partial'),
    times = partial.partialize(function (a, b) {
        return a * b;
    }),

    times3 = partial.partialize(function (a, b, c) {
        return a * b * c;
    }),

    this_length = partial.partialize(function (unused1, unused2) {
        return this && this.length;
    }),

    no_param = partial.partialize(function () {
        return 10;
    }),

    one_param = partial.partialize(function (a) {
        return a;
    }),

    WithProp = partial.partialize(function (name, val) {
        this[name] = val;
    }),

    MyMath = partial.partialize({
        times: function(a, b) {
            return a * b;
        }
    });

exports.result = function (beforeExit, assert) {
    assert.equal(times(2)(5), 10);
    assert.equal(times(2, 5), 10);
    assert.equal(times3(2)(5)(3), 30);
    assert.equal(times3(2)(5, 3), 30);
    assert.equal(times3(2, 5)(3), 30);
    assert.equal(times3(2, 5, 3), 30);
    assert.equal(times3()(2)()(5)()(3), 30);
    assert.equal(no_param(), 10);
    assert.equal(one_param(10), 10);
};

exports['this'] = function (beforeExit, assert) {
    assert.equal(this_length(0).call([2, 5], 0), 2);
    assert.equal(this_length.call([2, 5], 0)(0), undefined);
    assert.equal(this_length(0)(0), undefined);
};

exports.construct = function (beforeExit, assert) {
    assert.deepEqual(new WithProp('x', 10), {x: 10});
    assert.deepEqual(new (WithProp('x'))(10), {x: 10});
    assert.deepEqual(new (WithProp('x')())(10), {x: 10});
    assert.deepEqual(new (WithProp()('x'))(10), {x: 10});
};

exports.object = function (beforeExit, assert) {
    assert.equal(MyMath.times(2, 5), 10);
    assert.equal(MyMath.times(2)(5), 10);
    assert.equal(MyMath.times(2)()(5), 10);
};

/*
exports.length = function (beforeExit, assert) {
    assert.equal(times.length, 2);
    assert.equal(times(1).length, 1);
};
*/
