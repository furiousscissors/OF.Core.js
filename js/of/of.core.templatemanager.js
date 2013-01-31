/*!
* of.core.templatemanager.js - Template Manager utilizing underscore.js
* Released under the MIT license
* @author Travis Sharp - furiousscissors@gmail.com
*/

defOnce("OF.Core.TemplateManager", function () {
    function TM() {
        var files = [],
            compiledTemplates = [];
        /**
        * Replaces %7B%7B %7D%7D with {{ }} or the triple mustache for use with mustache.js templating - internal function only
        * @name unescapeMustache
        * @function
        * @memberOf OF.Core.TemplateManager
        * @param template Template Text
        * @return {String|XML}
        */
        function unescapeMustache(template) {
            var reLeft = new RegExp("%7B%7B", "g"),
                reRight = new RegExp("%7D%7D", "g"),
                reLeft3 = new RegExp("%7B%7B%7B", "g"),
                reRight3 = new RegExp("%7D%7D%7D", "g");

            // You need to replace the triple mustache before the double.
            return template
                    .replace(reLeft3, "{{{")
                    .replace(reRight3, "}}}")
                    .replace(reLeft, "{{")
                    .replace(reRight, "}}");

        }

        /**
        * Loads a template into the manager cache.
        * @name loadTemplate
        * @function
        * @memberOf OF.Core.TemplateManager.prototype
        * @param templatename
        * @param filename
        */
        this.loadTemplate = function (templatename, filename) {
            var fileValid = (filename !== null && filename !== undefined && filename.length > 0),
                templateNameValid = (templatename !== null && templatename !== undefined && templatename.length > 0),
                f = null;

            OF.Core.assert(fileValid, "OF.Core.TemplateManager.loadTemplate", "Invalid File Uri");
            OF.Core.assert(templateNameValid, "OF.Core.TemplateManager.loadTemplate", "Invalid Template Name.");

            if (files[templatename] === undefined || files[templatename] !== null) {
                files[templatename] = new OF.Core.File(filename);
            } else {
                OF.Core.Log.w("OF.Core.TemplateManager", "Template already loaded, keeping existing template");
            }
        };

        /**
        * Renders an underscore template. It is possible to do multiple levels of templates using the unescape flag.
        * @name render
        * @function
        * @memberOf OF.Core.TemplateManager.prototype
        * @param templatename
        * @param data
        * @param unescapebefore
        * @param unescapeafter
        * @return {*}
        */       
        this.render = function (templatename, data, unescapebefore, unescapeafter) {
            var templateNameValid = (templatename !== null && templatename !== undefined && templatename.length > 0),
                templateValid = (files[templatename] !== undefined && files[templatename] !== null),
                isCompiled = (compiledTemplates[templatename] !== undefined && files[templatename] !== null),
                compiled = null;

            OF.Core.assert(templateNameValid, "OF.Core.TemplateManager.render", "Invalid Template Name - " + templatename);
            OF.Core.assert(templateValid, "OF.Core.TemplateManager.render", "You must load a template before loading it - " + templatename);

            if (!isCompiled) {
                compiledTemplates[templatename] = compiled = _.template((unescapebefore === true ?
                _.unescape(files[templatename].open()) :
                files[templatename].open()));
            } else {
                compiled = compiledTemplates[templatename];
            }

            return (unescapeafter === true ? _.unescape(compiled(data)) : compiled(data));
        };
        
        this.cacheTemplate = function (templatename, data) {
            files[templatename] = (new OF.Core.File()).setFileData(data);
        };

        this.templateExists = function (templatename) {
            return (files[templatename] !== undefined && files[templatename] !== null);
        };

        this.getCachedTemplate = function (templatename) {
            var templateNameValid = (templatename !== null && templatename !== undefined && templatename.length > 0),
                templateValid = (files[templatename] !== undefined && files[templatename] !== null),
                templateData = null;

            OF.Core.assert(templateNameValid, "OF.Core.TemplateManager.render", "Invalid Template Name - " + templatename);
            OF.Core.assert(templateValid, "OF.Core.TemplateManager.render", "You must load a template before loading it - " + templatename);
            templateData = files[templatename].open();

            return templateData;
        }

        /**
        * Removes the template from the cached data.
        * @param templatename
        * @return {Boolean} Returns true if the template was valid. This also indicates that the template was removed.
        */
        this.unloadTemplate = function (templatename) {
            var templateValid = (files[templatename] !== undefined && files[templatename] !== null),
                template = files[templatename];
            if (templateValid) {
                files.splice(template);
            }
            return templateValid;
        }

        /**
        * Returns the key values of all cached templates.
        * @return {Array}
        */
        this.getTemplateIds = function () {
            var names = [],
                key;

            for (key in files) {
                names.push(key);
            }
            return names;
        }

        this.duplicateTemplates = function (templateManager) {
            OF.Core.assert(templateManager instanceof TM, "OF.Core.TemplateManager.prototype.duplicateTemplates",
                "You must specify a template manager object in order to replicate the templates.");

            var templates = [],
                key;

            for (key in files) {
                templateManager.cacheTemplate(key, files[key]);
            }
        }
    }

    return TM;
});