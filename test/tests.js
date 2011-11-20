/**
 * Copyright 2011 Adrian Lang <mail@adrianlang.de>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

"use strict";

var partial = require('partial'),
    times = partial.partialize(function (a, b) {
        return a * b;
    }),

    times3 = partial.partialize(function (a, b, c) {
        return a * b * c;
    }),

    times4 = partial.partialize(function (a, b, c, d) {
        return a * b * c * d;
    }),

    times5 = partial.partialize(function (a, b, c, d, e) {
        return a * b * c * d * e;
    }),

    times6 = partial.partialize(function (a, b, c, d, e, f) {
        return a * b * c * d * e * f;
    }),

    times7 = partial.partialize(function (a, b, c, d, e, f, g) {
        return a * b * c * d * e * f * g;
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
        times: function (a, b) {
            return a * b;
        },

        'this': function (a, b) {
            return this;
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
    assert.equal(times4(1)(2)(3)(4), 24);
    assert.equal(times5(1)(2)(3)(4)(5), 120);
    assert.equal(times6(1)(2)(3)(4)(5)(6), 720);
    assert.equal(times7(1)(2)(3)(4)(5)(6)(7), 5040);
};

exports['this'] = function (beforeExit, assert) {
    assert.equal(this_length(0).call([2, 5], 0), undefined);
    assert.equal(this_length.call([2, 5], 0)(0), 2);
    assert.equal(this_length(0)(0), undefined);
    assert.equal(MyMath['this'](2, 5), MyMath);
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

exports.length = function (beforeExit, assert) {
    assert.equal(times.length, 2);
    assert.equal(times(1).length, 1);
};

exports.functionP = function (beforeExit, assert) {
    var times = function (a, b) {
        return a * b;
    };

    partial.functionP(times);

    assert.equal(times.p(2)(5), 10);
    assert.equal(times.p(2, 5), 10);
};

exports.prototypeP = function (beforeExit, assert) {
    var times = function (a, b) {
        return a * b;
    }, protoP = Function.prototype.p;

    partial.prototypeP();

    assert.equal(times.p(2)(5), 10);
    assert.equal(times.p(2, 5), 10);

    Function.prototype.p = protoP;
};

exports.partial = function (beforeExit, assert) {
    var times = function (a, b) {
        return a * b;
    };

    assert.equal(partial(times)(2)(5), 10);
    assert.equal(partial(times)(2, 5), 10);
};
