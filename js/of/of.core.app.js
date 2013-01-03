/*!
* of.core.app.js - Simple Application Class v0.1
* Released under the MIT license
* @author Travis Sharp - furiousscissors@gmail.com
*/

defOnce("OF.Core.App", function () {
    /**
    * Defines an application within the current JS context.
    * @author Travis Sharp - furiousscissors@gmail.com
    * @name OF.Core.App
    * @constructor
    */
    function App(applicationName) {
        /** Inherited Classes */
        OF.Core.inherits(OF.Core.IDisposable, this);
        OF.Core.inherits(OF.Core.IObservable, this);

        /**
        * Private Variables
        */
        var appName = applicationName;

        /**
        * Internal Methods
        */
        this.getName = function getName() {
            return appName;
        };
    }

    /** Basic Initialization Functions */
    App.prototype.init = function init() {
        OF.Core.Log.d("App.prototype.init", ("init function has not been overridden."));
    };

    return App;
});