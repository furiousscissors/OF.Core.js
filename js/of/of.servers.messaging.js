/// <reference path="defonce.js" />
/// <reference path="of.core.js" />
/// <reference path="../json2.js" />

/*!
* of.servers.messaging.js - Cross-Frame Messaging Library v0.1
* Released under the MIT license
* @author Travis Sharp - furiousscissors@gmail.com
*/

defOnce('OF.Servers.MessageEvent', function () {
    function MessageEvent(eName, eData) {
        this.name = eName,
            this.data = eData;
    }
    return MessageEvent;
});

defOnce('OF.Servers.MessageHandler', function () {
    function FrameHandler(messageName, callback) {
        this.messageName = messageName,
            this.callback = callback;
    }

    return FrameHandler;
});

defOnce('OF.Servers.MessageServer', function () {
    function MessageServer(serverName) {
        var serverName = serverName,
            events = [],
            server = this,
            echoAlert = false,
            synchronized = false,
            messagebuffer = [];

        this.subscribe = function (eventName, callback) {
            events[eventName] = events[eventName] || [];
            events[eventName].push(new OF.Servers.MessageHandler(eventName, callback));
            // Enable chaining
            return this;
        };

        this.register = function (eventName) {
            events[eventName] = events[eventName] || [];
            // Enable chaining
            return this;
        };

        this.notify = function (eventName) {
            var i,
                handlers = events[eventName],
                args;

            if (handlers) {
                args = Array.prototype.slice.call(arguments, 1);
                for (i = 0; i < handlers.length; i++) {
                    handlers[i].callback.apply(null, args);
                }
            }
            // Enable chaining
            return this;
        };

        this.send = function (name, data) {
            try {
                if(typeof client.postMessage === 'function') {
                    /*
                    if(synchronized) {
                        // Push all backed up messages.
                        if(name === 'PUSH') {
                            var key = null;
                            for(var key in messagebuffer) {
                                client.postMessage(JSON.stringify(messagebuffer[key], '*'));
                            }

                            messagebuffer = [];
                        } else {
                            client.postMessage(JSON.stringify(new OF.Servers.MessageEvent(name, data)), '*');
                        }
                    } else {
                        messagebuffer.push(JSON.stringify(new OF.Servers.MessageEvent(name, data)));
                    }
                    */

                    client.postMessage(JSON.stringify(new OF.Servers.MessageEvent(name, data)), '*');
                } else {
                    OF.Core.Log.e('OF.Servers.MessageServer', 'Client does not have a postMessage property - unable to post message.');
                }
            }catch(ex) {
                OF.Core.Log.e('OF.Servers.MessageServer', ex);
            }
        };

        this.getEchoAlert = function () {
            var ea = echoAlert;
            return ea;
        }

        this.setEchoAlert = function (value) {
            echoAlert = (value === true) ? true : false;
        }

        function receiveMessage(event) {
            var e = JSON.parse(event.data);
            server.notify(e.name, e);
        }

        function registerWindowHandler() {
            window.addEventListener("message", receiveMessage, false);
        }

        this.init = function () {
            registerWindowHandler();
            if ($('#client-app').length === 1) {
                client = $('#client-app')[0].contentWindow;
            } else {
                client = window.parent;
            }

            this.subscribe('echo', function (message) {
                var builder = new OF.Core.StringBuilder();
                builder.append(serverName);
                builder.append(" received echo: ");
                builder.append(message.data);

                if(echoAlert === true) {
                    alert(builder.toString());
                }

                OF.Core.Log.i(builder.toString());
            });

            /*
            this.subscribe('ACK', function (message) {
                server.notify('SYN ACK');
            });

            this.subscribe('SYN ACK', function (message) {
                server.notify('SYN');
            });

            this.subscribe('SYN', function (message) {
                server.notify('PUSH');
            });

            server.notify('SYN');
            */
        };
    };

    return MessageServer;
});