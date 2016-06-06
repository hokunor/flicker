(function () {
    "use strict";
    if (typeof(window.app) === 'undefined') {
        window.app = {};
    }
    var date_hand = function () {
        this.monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    };
    date_hand.prototype.format = function (data) {
        var date_stamp = new Date(data),
            hour = date_stamp.getHours(),
            minute = date_stamp.getMinutes(),
            date_parsed;
        if (hour < 10) {
            hour = '0' + hour;
        }
        if (minute < 10) {
            minute = '0' + minute;
        }

        date_parsed = hour + ':' +
             minute + ' ' +
             date_stamp.getDate() + '-' +
             this.monthNames[date_stamp.getMonth() - 1] + '-' +
             date_stamp.getFullYear();

        return date_parsed;
    };
    app.date = new date_hand();
})();