(function() {
    function StringBuffer() {
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

    define([], function() {
        return Object.seal(StringBuffer);
    });
})();