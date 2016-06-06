(function () {
    "use strict";
    if (typeof(window.app) === 'undefined') {
        window.app = {};
    }
    app.ajax = function (url, params) {
        var method = 'GET',
            form = null,
            key,
            xhr = new XMLHttpRequest(),
            _done = function (res) {
            },

            _error = function (res) {
                window.app.error.standard(res);
            };
        if (typeof(params) === 'undefined') {
            params = {};
        }
        if (params.method) {
            method = params.method;
        }
        if (method === 'POST') {
            form = new FormData();
            if (params.data) {
                for (key in params.data) {
                    form.append(key, params.data[key]);
                }
            }
        }
        xhr.open(method, url, true);
        if (params.response_type) {
            xhr.responseType = params.response_type;
        } else {
            params.response_type = 'json';
            xhr.responseType = 'json';
        }
        xhr.onload = function (event) {
            var response;
            if (params.response_type !== 'null') {
                if (this.status === 200 || this.status === 304) {
                    if (params.response_type === 'json') {
                        response = JSON.parse(this.response);
                        if (response.status === 'ok') {
                            _done(response);
                        }
                        else {
                            _error(response);
                        }
                    }
                    else if (params.response_type === 'xml') {
                        response = this.responseXML;
                        if (response) {
                            _done(response);
                        } else {
                            _error(response);
                        }
                    }
                    else {
                        if (this.response) {
                            _done(this.response);
                        } else {
                            _error(this.response);
                        }
                    }
                } else {
                    _error({'response': this.response, 'status': this.status});
                }
            }
        };
        xhr.send(form);
        return {
            done: function (callback) {
                if (typeof(callback) === 'function') {
                    _done = callback;
                }
                return this;
            },
            error: function (callback) {
                if (typeof(callback) === 'function') {
                    _error = callback;
                }
                return this;
            }
        };
    };
})();
