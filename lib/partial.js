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
(function (root) {
    var previousPartial,
        slice = Array.prototype.slice,
        bind = Function.prototype.bind,
        partial = function (fn/*, ... */) {
            return partial.partialize(fn).apply(this, slice(arguments, 1));
        };

    // Export the partial object for **Node.js** and **"CommonJS"**, with
    // backwards-compatibility for the old `require()` API. If we're not in
    // CommonJS, add `partial` to the global object.
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = partial;
        }
        exports.partial = partial;
    } else if (typeof define === 'function' && define.amd) {
        // Register as a named module with AMD.
        define('partial', function () {
            return partial;
        });
    } else {
        previousPartial = root.partial;

        // Exported as a string, for Closure Compiler "advanced" mode.
        root['partial'] = partial;

        // Run partial in *noConflict* mode, returning the `partial` variable
        // to its previous owner. Returns a reference to the partial object.
        partial.noConflict = function () {
            root.partial = previousPartial;
            return this;
        };
    }

    function fakeFunctionLength(fn, length) {
        var fns = [
            function () { return fn.apply(this, arguments); },
            function (a) { return fn.apply(this, arguments); },
            function (a, b) { return fn.apply(this, arguments); },
            function (a, b, c) { return fn.apply(this, arguments); },
            function (a, b, c, d) { return fn.apply(this, arguments); },
            function (a, b, c, d, e) { return fn.apply(this, arguments); },
            function (a, b, c, d, e, f) { return fn.apply(this, arguments); }
        ], argstring;

        if (length < fns.length) {
            return fns[length];
        }

        argstring = '';
        while (--length) {
            argstring += ',_' + length;
        }
        return new Function('fn',
            'return function (_' + argstring + ') {' +
                'return fn.apply(this, arguments);' +
            '};')(fn);
    }

    if (!bind) {
        bind = function (oThis) {
            var aArgs = slice.call(arguments, 1),
                fToBind = this,
                fNOP = function () {},
                fBound = fakeFunctionLength(function () {
                    return fToBind.apply(this instanceof fNOP
                                           ? this
                                           : oThis,
                                         aArgs.concat(slice.call(arguments)));
                }, Math.max(0, this.length - aArgs.length));

            fNOP.prototype = this.prototype;
            fBound.prototype = new fNOP();

            return fBound;
        };
    }
    /**
     * Helper function for partial application
     * This function expects a function, an argument count, and an
     * argument array. If the number of arguments given is less than the
     * number the function expects, partial returns a new function
     * expecting only the missing parameters, with the given parameters
     * already bound.
     */
    function part(callee, argc, argv) {
        if (argv.length < argc) {
            argv = slice.apply(argv);
            argv.unshift(this);
            return bind.apply(callee, argv);
        }
    }

    /**
     * Create a wrapper function supporting partial application
     *
     * This function expects a function and returns a wrapper function
     * supporting partial application.
     */
    function partialize(inp) {
        if (typeof inp === 'function') {
            var len = inp.length,
                wrapper = fakeFunctionLength(function (/* ... */) {
                    return part.call(this, wrapper, len, arguments) ||
                           inp.apply(this, arguments);
                }, len);

            return wrapper;
        } else {
            for (var key in inp) {
                if (inp.hasOwnProperty(key) &&
                    typeof inp[key] === 'function' &&
                    inp[key].length > 0) {
                    inp[key] = partialize(inp[key]);
                }
            }
            return inp;
        }
    }

    function functionP(fn) {
        fn.p = partialize(fn);
        return fn;
    }

    function prototypeP() {
        Function.prototype.p = function () {
            functionP(this);
            return this.p.apply(null, arguments);
        };
    }

    partial.partialize = partialize;
    partial.functionP = functionP;
    partial.prototypeP = prototypeP;
}(this));
