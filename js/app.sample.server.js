/**
 * Created with JetBrains WebStorm.
 * User: Travis
 * Date: 1/2/13
 * Time: 7:05 PM
 * To change this template use File | Settings | File Templates.
 */

defOnce("Samples.App.MessageServer", function() {
    function MessageServer () {
        // Inherit the OF.Core application
        OF.Core.inherits(OF.Core.App, this, "Sample Message Server");

        // Setup Message Server Property
        var messageServer = new OF.Servers.MessageServer('server');

        //@Override
        this.init = function () {
            messageServer.init();
            messageServer.subscribe("echo", function(message) {
                $("#messages").append(message.data);
            });
        }

        this.getMessageServer = function () {
            // Prevents the ability to change the private variable
            var m = messageServer;
            return m;
        }
    }

    return MessageServer;
});
