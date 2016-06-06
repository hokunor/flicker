(function (window, document) {
    "use strict";

    if (window.app === undefined) {
        window.app = {};
    }
    app.moduleLoader = function () {
        var that = this;
        this.headNode = document.getElementsByTagName('head')[0];
        this.styles = [];
        this.modules = [];
        this.loadingModules = [];
        this.temp = [];
        this.tempCount = 0;

        this.loadingJs = function (name, callback) {
            var jsNode = document.createElement('script');
            jsNode.setAttribute('type', 'text/javascript');
            jsNode.setAttribute('src', window.location.protocol + '//' + this.staticDomain + '/js/' + name + this.staticJsVersion + '.js');
            jsNode.async = true;

            jsNode.onload = function () {
                that.loaded(that, name, callback);
            };

            jsNode.onerror = function () {
                app.error.standard({type: 'loadJs', content: 'can\'t load javascript: "' + name + '.js"'});
            };
            that.temp.slice(name, 1);
            delete that.temp[name];
            this.headNode.appendChild(jsNode);
        };
        this.loaded = function (that, name, callback) {
            that.tempCount -= 1;
            that.modules[name] = {};
            if (that.tempCount === 0) {
                that.temp = [];
                callback();
            }
        };
    };

    app.moduleLoader.prototype.staticDomain = 'localhost';
    app.moduleLoader.prototype.staticJsVersion = '';
    app.moduleLoader.prototype.staticCssVersion = '';

    app.moduleLoader.prototype.loadCss = function (name) {
        var cssNode = document.createElement('link');
        cssNode.setAttribute('type', 'text/css');
        cssNode.setAttribute('rel', 'stylesheet');
        cssNode.setAttribute('href', window.location.protocol + '//' + this.staticDomain + '/css/' + name +
            this.staticCssVersion + '.css');
        this.headNode.appendChild(cssNode);
    };

    app.moduleLoader.prototype.loadJs = function (loadModules, callback) {
        for (var key in loadModules) {
            if (loadModules.hasOwnProperty(key)) {
                if (this.modules[loadModules[key]]) {
                    loadModules.splice(key, 1);

                }
                else {
                    this.temp[loadModules[key]] = {};
                    ++this.tempCount;
                }
            }
        }
        ;

        if (this.tempCount) {
            for (var mod in this.temp) {
                if (this.temp.hasOwnProperty(mod)) {
                    this.loadingJs(mod, callback);
                }
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