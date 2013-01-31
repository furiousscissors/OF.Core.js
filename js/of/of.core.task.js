/*!
* of.core.task.js - Simple Task Runner
* Released under the MIT license
* @author Travis Sharp - furiousscissors@gmail.com
*/

defOnce('OF.Core.Task', function () {
    function Task(name, callback, interval) {
        OF.Core.inherits(OF.Core.IDisposable);

        var isBusy = false,
            processor,
            started,
            stopped,
            result,
            me = this,
        defaultInterval = 250;  // The default interval is 250 Milliseconds

        this.start = function () {
            processor = setInterval(function () {
                if (!isBusy) {
                    if (!isBusy) {
                        isBusy = true;
                        result = callback();
                        if (result === true) {
                            me.dispose();
                        }
                    }
                }
            }, interval === undefined || interval === null ? defaultInterval : interval);
        }

        this.dispose = function () {
            clearInterval(processor);
            this.superDispose();
        }

    }

    return Task;
});