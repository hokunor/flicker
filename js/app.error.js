(function () {
    "use strict";
    var error_handler;
    if (typeof(window.app) === 'undefined') {
        window.app = {};
    }
    error_handler = function () {
        this.send_to_service = function (data) {
            var params = {data: data, response_type: 'null'};
            console.log(data);
            app.ajax('/error-log.html', params).done(function () {
            });
        };
    };

    error_handler.prototype.standard = function (data) {
        this.send_to_service(data);
    };

    app.error = new error_handler();

})();