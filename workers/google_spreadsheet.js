var GoogleSpreadsheet = require("google-spreadsheet");

module.exports = function (username, password) {
  return function (data, cb) {

    var spreadsheet = new GoogleSpreadsheet(data.spreadsheet);
    var worksheet = data.worksheet|| 0;

    function addRow(err) {
      if (err) {
        return cb(err);
      }

      if (!data.row) {
        return cb(new Error('You must send a "row" object with event data'));
      }

      // Add a date
      data.row.createdat = new Date();

      spreadsheet.addRow(worksheet, data.row, function (err, row) {
        if (err) {
          return cb(err);
        }
        cb(null, row);
      });
    }

    // Auth is required
    if (!username || !password) {
      return cb(new Error('GOOGLE_USERNAME and GOOGLE_PASSWORD are required in your .env'));
    }

    spreadsheet.setAuth(username, password, addRow);

  };
};
