const moment = require("moment/moment");

module.exports.isValidDate = function (date) {
    let formats = [
        //moment.ISO_8601,
        //"MM/DD/YYYY",
        "YYYY-MM-DD",
    ];
    return moment(date, formats, true).isValid()
}

module.exports.isNumeric = function (value) {
    return /^\d+$/.test(value.toString());
}