(function () {
    "use strict";
    if (typeof(window.app) === 'undefined') {
        window.app = {};
    }
    var dateHand = function () {
        this.monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    };
    dateHand.prototype.format = function (data) {
        var dateStamp = new Date(data),
            hour = dateStamp.getHours(),
            minute = dateStamp.getMinutes(),
            dateParsed;
        if (hour < 10) {
            hour = '0' + hour;
        }
        if (minute < 10) {
            minute = '0' + minute;
        }

        dateParsed = hour + ':' +
             minute + ' ' +
             dateStamp.getDate() + '-' +
             this.monthNames[dateStamp.getMonth() - 1] + '-' +
             dateStamp.getFullYear();

        return dateParsed;
    };
    app.date = new dateHand();
})();