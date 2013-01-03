/*!
* OF.Core.js - Core Library v0.1
* Released under the MIT license
* @author Travis Sharp - furiousscissors@gmail.com
*/

/** NOTE: This must always be the first definition. */
defOnce("OF.Core", function () {
    /**
    * Defines the settings for the Core namespace. Internal CFG etc ...
    * @author Travis Sharp - furiousscissors@gmail.com
    * @name OF.Core.SettingsDescriptor
    * @constructor
    */
    var SettingsDescriptor = function () {

        /**
        * Turns internal debugging on or off. Logging functions are directly tied to this.
        * @name IsDebug
        * @memberOf OF.Core.SettingsDescriptor.prototype
        * @type {Boolean}
        */
        this.IsDebug = true;
    };

    /**
    * Core namespace/object
    * @author Travis Sharp - furiousscissors@gmail.com
    * @name OF.Core
    * @namespace Core Namespace
    */
    var Core = {};

    /**
    * Contains internal settings
    * @name OF.Core.Settings
    * @type {OF.Core.SettingsDescriptor}
    */
    Core.Settings = new SettingsDescriptor();

    /**
    * This makes sure that a particular class definition inherits from another class definition.
    * DO NOT CALL THIS FROM OUTSIDE THE CONSTRUCTOR!!! This will overwrite any existing variables,
    * In order to preserve inheritance order, "inherit" in the order you wish to inherit from
    * because each subsequent call will append/overwrite the previous.
    * @name inherits
    * @function
    * @memberOf OF.Core
    * @param sourceClass Source Class or Object
    * @param targetObj Destination object
    */
    Core.inherits = function (sourceClass, targetObj) {
        var args = Array.prototype.slice.call(arguments, 2);
        sourceClass.apply(targetObj, args);
        for (var attr in sourceClass.prototype) {
            if (!targetObj.hasOwnProperty(attr)) targetObj[attr] = sourceClass.prototype[attr];
        }
    };

    /**
    * Throws an exception if a boolean expression is not passed in and if the boolean value evaluates to false.
    * The exception message is in the format of - {tag}: {message}
    * @name assert
    * @param success Boolean value to evaluate
    * @param tag Message tag
    * @param message Message
    * @memberOf OF.Core
    */
    Core.assert = function (success, tag, message) {
        if (typeof success === "boolean" && !success === true) {
            throw tag + ": " + message;
        }
    };

    /**
    * Logging functions for debugging & general purpose
    * @author Travis Sharp - furiousscissors@gmail.com
    * @name Log
    * @constructor
    * @memberOf OF.Core
    */
    Core.Log = {
        Message: function (tag, message) {
            this.tag = tag;
            this.message = message;
            this.date = new Date();
        },
        Logs: {
            Debug: [],
            Error: [],
            Warning: [],
            Info: []
        },
        getMessage: function (message) {
            if (message !== null && message !== undefined) {
                return ((message.message === undefined || message.message === null) ? message : message.message);
            } else {
                return "";
            }
        },
        /**
        * Debug Logging Function - Calls console.log if available, does nothing if the function is not present.
        * @name d
        * @memberOf OF.Core.Log
        * @function
        * @param tag Tag used to identify caller or part of code
        * @param message Message sent back to user
        */
        d: function (tag, message) {
            // This catches potential issues when using this from within a callback
            if (this.Logs === undefined || this.Logs === null) {
                OF.Core.Log.d(tag, message);
            }

            if (window.console && Core.Settings.IsDebug) {
                if (this.Logs.Debug[tag] === undefined) {
                    this.Logs.Debug[tag] = [];
                }
                console.log(tag + ": " + this.getMessage(message));
                this.Logs.Debug[tag].push(new this.Message(tag, message));
            }
        },

        w: function (tag, message) {
            // This catches potential issues when using this from within a callback
            if (this.Logs === undefined || this.Logs === null) {
                OF.Core.Log.w(tag, message);
            }

            if (window.console && Core.Settings.IsDebug) {
                if (this.Logs.Warning[tag] === undefined) {
                    this.Logs.Warning[tag] = [];
                }
                console.warn(tag + ": " + this.getMessage(message));
                this.Logs.Warning[tag].push(new this.Message(tag, message));
            }
        },

        e: function (tag, message) {
            // This catches potential issues when using this from within a callback
            if (this.Logs === undefined || this.Logs === null) {
                OF.Core.Log.e(tag, message);
            }

            if (window.console && Core.Settings.IsDebug) {
                if (this.Logs.Error[tag] === undefined) {
                    this.Logs.Error[tag] = [];
                }
                console.error(tag + ": " + this.getMessage(message));
                this.Logs.Error[tag].push(new this.Message(tag, message));
            }
        },

        i: function (tag, message) {
            // This catches potential issues when using this from within a callback
            if (this.Logs === undefined || this.Logs === null) {
                OF.Core.Log.i(tag, message);
            }

            if (window.console && Core.Settings.IsDebug) {
                if (this.Logs.Info[tag] === undefined) {
                    this.Logs.Info[tag] = [];
                }
                console.info(tag + ": " + this.getMessage(message));
                this.Logs.Info[tag].push(new this.Message(tag, message));
            }
        }
    };

    return Core;
});

defOnce("OF.Core.IDisposable", function () {
    /**
    * Implements a Disposable object.
    * @author Travis Sharp - furiousscissors@gmail.com
    * @name OF.Core.IDisposable
    * @class
    * @constructor
    */
    function IDisposable() {
        var disposed = false;

        this.dispose = function () {
            disposed = true;
        };

        this.isDisposed = function () {
            return disposed;
        };
    }

    return IDisposable;
});

defOnce("OF.Core.IObservable", function () {
    function EventHandler(eventName, callback, disposableObject) {
        this.eventName = eventName;
        this.callback = callback;
        this.disposableObject = disposableObject;
    }

    /**
    * Implements the observer pattern
    * @author Travis Sharp - furiousscissors@gmail.com
    * @name OF.Core.IObservable
    * @class
    * @constructor
    */
    function Observable() {
        var events = {};

        function isRegistered(eventName, callback) {

        }

        /**
        * Subscribes a callback to a given event name
        * @memberOf OF.Core.IObservable.prototype
        * @function
        * @param eventName Tag used to identify event
        * @param callback Message sent back to user
        * @param disposableObject This is a reference back to the original observer, a disposableObject.
        * @return {this}
        */
        this.subscribe = function (eventName, callback, disposableObject) {
            OF.Core.assert((disposableObject !== null || disposableObject !== undefined) ||
                typeof disposableObject.isDisposed !== "function",
                "Observable.subscribe", "You must specify a disposable object.");
            events[eventName] = events[eventName] || [];
            events[eventName].push(new EventHandler(eventName, callback, disposableObject));
            // Enable chaining
            return this;
        };

        this.registerEvent = function (eventName) {
            events[eventName] = events[eventName] || [];
            // Enable chaining
            return this;
        };

        /**
        * Notifies that an event has been raised with a given event name
        * @memberOf OF.Core.IObservable.prototype
        * @param eventName
        * @return {this}
        */
        this.notify = function (eventName) {
            var i,
                handlers = events[eventName],
                args, toRemove = [];

            if (handlers) {
                args = Array.prototype.slice.call(arguments, 1);
                for (i = 0; i < handlers.length; i++) {
                    if (handlers[i].disposableObject.isDisposed()) {
                        toRemove.push(handlers[i]);
                    } else {
                        handlers[i].callback.apply(null, args);

                    }
                    if (toRemove.length > 0) {
                        for (i = 0; i < toRemove.length; i++) {
                            events[eventName].splice(toRemove[i]);
                        }
                    }
                }
            }
            // Enable chaining
            return this;
        };

        /**
        * Returns a list of current valid events.
        * @memberOf OF.Core.IObservable.prototype
        * @return {Array}
        */
        this.getEvents = function () {
            var key,
                validEvents = [];
            for (key in events) {
                validEvents.push(key);
            }

            return validEvents;
        };

        this.hasEvent = function (eventName) {
            var key;
            for (key in events) {
                if (key === eventName) return true;
            }
            return false;
        };
    }
    return Observable;
});

defOnce("OF.Core.File", function () {
    /**
    * Defines a File object
    * @author Travis Sharp - furiousscissors@gmail.com
    * @name OF.Core.File
    * @class
    * @param fname Uri Location or FileName
    * @constructor
    */
    function File(fname) {
        /**
        * Name of current file
        * @name filename
        * @private
        * @memberOf OF.Core.File
        * @type {String}
        */
        var filename = fname;

        /**
        * Current available filedata
        * @name filedata
        * @private
        * @memberOf OF.Core.File
        * @type {String}
        */
        var filedata = "";

        /**
        * Returns the file name of the a file.
        * @function
        * @memberOf OF.Core.File.prototype
        */
        this.getFileName = function () {
            var newFileName = filename;
            return newFileName;
        };

        /**
        * Returns file string data
        * @function
        * @memberOf OF.Core.File.prototype
        * @return {String}
        */
        this.getFileData = function () {
            var data = filedata;
            return data;
        };

        /**
        * Sets file string data
        * @function
        * @memberOf OF.Core.File.prototype
        * @param data
        */
        this.setFileData = function (data) {
            filedata = data;
            // Allow chaining
            return this;
        };

        /**
        * Returns the length of the filename
        * @function
        * @memberOf OF.Core.File.prototype
        * @return {Number}
        */
        this.getFileNameLength = function () {
            return filename.length;
        };

        /**
        * Returns the length of the current loaded data
        * @function
        * @memberOf OF.Core.File.prototype
        * @return {Number}
        */
        this.getFileLength = function () {
            return filedata.length;
        };
    }

    /**
    * Returns the extension of a a file.
    * @name getExtension
    * @memberOf OF.Core.File.prototype
    * @function
    * @return {String}
    */
    File.prototype.getExtension = function () {
        return this.getFileName().split('.').pop();
    };

    /**
    * Injects a css or js file into the current html page. Returns the current file object to allow chaining.
    * @name inject
    * @memberOf OF.Core.File.prototype
    * @function
    * @return {OF.Core.File}
    */
    File.prototype.inject = function () {
        /*
        Modernizr.load({
        test: true,
        yep : this.getFileName(),
        nope: null
        });
        */
        return this;
    };

    /**
    * Opens a file from a given url and returns its text. If the text already exists, it returns the local copy to
    * help speed things up.
    * @name open
    * @memberOf OF.Core.File.prototype
    * @function
    * @return {String}
    */
    File.prototype.open = function () {
        // Load data if we must
        if (this.getFileLength() === 0 && this.getFileNameLength() > 0) {
            // Load a file from a remote/local uri.
            var request = new XMLHttpRequest();
            request.open("GET", this.getFileName(), false);
            request.send(null);
            this.setFileData(request.responseText);
            return this.getFileData();
        }

        return this.getFileData();
    };

    return File;
});

defOnce("OF.Core.StringBuilder", function () {
    function StringBuilder() {
        var buffer = [];

        this.getRaw = function () {
            return buffer;
        };

        this.setRaw = function (data) {
            buffer = data;
        };

        this.append = function (value) {
            buffer.push(value);
            return this;
        };

        this.encodeAppend = function (value) {
            buffer.push(encodeURIComponent(value));
            return this;
        };

        this.toString = function () {
            return buffer.join("");
        };

        this.clear = function () {
            buffer = [];
            return this;
        };

        this.combine = function (builder, combineWithSelf) {
            if (combineWithSelf === true) {
                buffer = buffer.concat(builder.getRaw());
                return this;
            }

            var sb = new StringBuilder();
            sb.setRaw(buffer.concat(builder.getRaw()));
            return sb;
        };
    }

    return StringBuilder;
});