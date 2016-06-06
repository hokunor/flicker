(function (window, document) {
    "use strict";

    if (window.app === undefined) {
        window.app = {};
    }
    app.moduleLoader = function () {
        var that = this;
        this.head_node = document.getElementsByTagName('head')[0];
        this.styles = [];
        this.modules = [];
        this.loading_modules = [];
        this.temp = [];
        this.temp_count = 0;

        this.loadingJs = function (name, callback) {
            var jsNode = document.createElement('script');
            jsNode.setAttribute('type', 'text/javascript');
            jsNode.setAttribute('src', window.location.protocol + '//' + this.static_domain + '/js/' + name + this.static_js_version + '.js');
            jsNode.async = true;

            jsNode.onload = function () {
                that.loaded(that, name, callback);
            };

            jsNode.onerror = function () {
                app.error.standard({type: 'loadJs', content: 'can\'t load javascript: "' + name + '.js"'});
            };
            that.temp.slice(name, 1);
            delete that.temp[name];
            this.head_node.appendChild(jsNode);
        };
        this.loaded = function (that, name, callback) {
            that.temp_count -= 1;
            that.modules[name] = {};
            if (that.temp_count === 0) {
                that.temp = [];
                callback();
            }
        };
    };

    app.moduleLoader.prototype.static_domain = 'localhost';
    app.moduleLoader.prototype.static_js_version = '';
    app.moduleLoader.prototype.static_css_version = '';

    app.moduleLoader.prototype.loadCss = function (name) {
        var cssNode = document.createElement('link');
        cssNode.setAttribute('type', 'text/css');
        cssNode.setAttribute('rel', 'stylesheet');
        cssNode.setAttribute('href', window.location.protocol + '//' + this.static_domain + '/css/' + name +
            this.static_css_version + '.css');
        this.head_node.appendChild(cssNode);
    };

    app.moduleLoader.prototype.loadJs = function (load_modules, callback) {
        for (var key in load_modules) {
            if (this.modules[load_modules[key]]) {
                load_modules.splice(key, 1);

            }
            else {
                this.temp[load_modules[key]] = {};
                ++this.temp_count;
            }
        }
        ;

        if (this.temp_count) {
            for (var mod in this.temp) {
                this.loadingJs(mod, callback);
            }
        }
        else {
            callback();
        }
    };

    app.router = function () {
        this.route = [];
        this.route.flick = {path: '/', modules: ['flick'], css: 'flick'};
    };

    app.router.prototype.getRoute = function (route) {
        return this.route[route];
    };

    app.router.prototype.go = function (route, cb) {
        if (this.route[route]) {
            history.pushState({route: route});
        }
        else {
            app.error.standard({type: 'router', content: ' cant find route: "' + route + '"'});
        }
    };

    app.history = function () {

    };

    app.core = function () {
        var that = this;
        this.router = new app.router();
        this.loader = new app.moduleLoader();
        this.loader.loadJs(['app.error', 'app.ajax', 'app.date'], function () {
            that.init(that);
        });
    };

    app.core.prototype.init = function (that) {
        var body = document.getElementsByTagName('body')[0];
        var initialRoute, route;
        if (body.hasAttribute('data-router')) {
            initialRoute = body.getAttribute('data-router');
            route = that.router.getRoute(initialRoute);
            that.loader.loadJs(route.modules, function () {
                app[initialRoute].bind();
            });

            if (route.css) {
                this.loader.loadCss(route.css);
            }
        }
    };

    var application = new app.core();

})(window, document);