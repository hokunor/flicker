(function () {
    "use strict";
    var errorHandler;
    if (typeof(window.App) === 'undefined') {
        window.App = {};
    }
    errorHandler = function () {
        this.sendToService = function (data) {
            var params = {data: data, responseType: 'null'};
            console.log(data);
            App.ajax('/error-log.html', params).done(function () {
            });
        };
    };

    errorHandler.prototype.standard = function (data) {
        this.sendToService(data);
    };

    App.error = new errorHandler();

})();