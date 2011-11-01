var Aps = Array.prototype.slice;

function bind(fnc/*, ... */) {
    // Store passed arguments in this scope.
    // Since arguments is no Array nor has an own slice method,
    // we have to apply the slice method from the Array.prototype
    var static_args = Aps.call(arguments, 1);

    // Return a function evaluating the passed function with the
    // given args and optional arguments passed on invocation.
    return function (/* ... */) {
        // Same here, but we use Array.prototype.slice solely for
        // converting arguments to an Array.
        return fnc.apply(this, static_args.concat(Aps.call(arguments)));
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
        argv = Aps.apply(argv);
        argv.unshift(callee);
        return bind.apply(this, argv);
    }
}

/**
 * Create a wrapper function supporting partial application
 *
 * This function expects a function and returns a wrapper function
 * supporting partial application.
 */
function partialize(func) {
    var len = func.length;
    return function wrapper(/* ... */) {
        return partial(wrapper, len, arguments) ||
               func.apply(this, arguments);
    };
}

exports.partialize = partialize;
