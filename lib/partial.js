var slice = Array.prototype.slice,
    bind = Function.prototype.bind;

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
function partial(callee, argc, argv) {
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
                return partial.call(this, wrapper, len, arguments) ||
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

exports.partialize = partialize;
