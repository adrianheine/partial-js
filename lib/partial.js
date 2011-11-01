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
 *
 * This function expects an arguments object as given in a function
 * call. If the number of arguments given is less than the number
 * the function expects, partial returns a new function expecting
 * only the missing parameters, with the given parameters already
 * bound.
 * The number of arguments the function expects may be overriden with
 * the second parameter. Otherwise, arguments.callee.length is used.
 * This is necessary for wrapper functions.
 */
function partial(arguments_, argc) {
    var argv = Aps.apply(arguments_);
    argc = argc || arguments_.callee.length;
    if (argv.length < argc) {
        argv.unshift(arguments_.callee);
        return bind.apply(this, argv);
    } else {
        return false;
    }
}

/**
 * Create a wrapper function supporting partial application
 *
 * This function expects a function and returns a wrapper function
 * supporting partial application.
 */
function partialize(func) {
    return function (/* ... */) {
        var part = partial(arguments, func.length);
        if (part !== false) {
            return part;
        }

        return func.apply(this, arguments);
    };
}

exports.partialize = partialize;
