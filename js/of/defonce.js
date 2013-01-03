/*!
* defOnce.js - Define Once Module v1.0.1
*
* Copyright (C) 2012 Travis Sharp.
* Released under the MIT license
* @author Travis Sharp - furiousscissors@gmail.com
*/

var __defaultDefOnceLocation = this;

/**
* A module/namespace implementation that recursively creates a namespace. If a source is defined as a function, the last
* object created will be set to the return value of the function. A static object $$ will be added to the object
* returned by the function call if it does not already exist; however, $$.globalObj will always be set to true. In
* addition, if it is a general namespace, the object will receive a namespace = true variable.
* @author Travis Sharp - furiousscissors@gmail.com
* @param namespaceString This is a string variable defining a namespace in relation to the dest variable or window
* if the dest is not specified. The namespaces should be separated by a .
* Example: Namespace.Test.Bob
* @param source Specifies the source of the namespace being set. This will also add the __namespace or $$ variables
* if they are not present.
* @param dest Specifies the destination variable. Defaults to window if not specified
* @param instantiate Initializes the object by calling new source() instead of setting class data itself
* @return {window or dest}
*/
function defOnce(namespaceString, source, dest, instantiate) {
    var parts = namespaceString.split('.'),
        currentPart = '',
        i = 0,
        length = parts.length,
        created = false;

    var parent = dest === null ||
        dest === "undefined" ||
        dest === undefined ? __defaultDefOnceLocation : dest;
    try {
        for (i = 0; i < length; i++) {
            currentPart = parts[i];

            if (i === (parts.length - 1) && typeof source === "function") {
                parent[currentPart] = parent[currentPart] || (instantiate === true ?
                    (function () {
                        if (source === null ||
                            source === undefined ||
                            typeof source !== "function") {
                            throw "defOnce: You must specify a source to instantiate one, and it must be a function.";
                        }
                        created = true;
                        return new (source())();
                    })()
                    : source());
                parent[currentPart].$$ = parent[currentPart].$$ || { unitTests: {} };
                parent[currentPart].$$.globalObj = true;
            } else {
                parent[currentPart] = parent[currentPart] ||
                    (function () {
                        created = true;
                        return { namespace: true };
                    })();
            }

            parent = parent[currentPart];
        }
    } catch (ex) {
        created = false;
        if (typeof OF !== "undefined") {
            OF.Core.Log.d("defOnce", ex);
        }

        throw ex;
    }

    return { created: created, obj: created === true ? parent : null };
}