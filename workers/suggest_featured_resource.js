module.exports = function (worksheet, spreadsheet, username, password) {
  return function (data, cb) {

    function addRow(err) {
      if (err) {
        return cb(err);
      }
      spreadsheet.addRow(worksheet, data, function (err, row) {
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
