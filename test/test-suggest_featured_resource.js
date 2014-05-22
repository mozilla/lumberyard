var should = require('should');
var Habitat = require('habitat');

describe('Suggest Featured Resource', function() {

  // Environment
  Habitat.load();

  var env = new Habitat();

  // Google Spreadsheet
  var PUBLIC_SHEET_KEY = '1swJ87dr03nxhYvn7uJoWpybE3kcLV2bW3OGoJ-H-z3o';
  var WORKSHEET_ID = 0;

  // Use real credentials, if they're available
  var username = env.get('GOOGLE_USERNAME');
  var password =  env.get('GOOGLE_PASSWORD');

  var GoogleSpreadsheet = require('google-spreadsheet');
  var suggestResourceInit = require('../workers/suggest_featured_resource');

  function TestRow() {
    this.date = new Date();
    this.email = 'testemail@daADdsdssd.com';
    this.username = 'testuser';
    this.locale = 'en-US';
    this.link = 'https://webmaker.org';
    this.webliteracy = 'weblit-Security';
  }

  describe('#suggest_featured_resource(data, callback)', function() {

    var spreadsheet = new GoogleSpreadsheet(PUBLIC_SHEET_KEY);

    it('should access a spreadsheet', function (done) {
      spreadsheet.getRows(0, function (err, rows) {
        if (err) {
          throw(err);
        }
        if (!rows) {
          throw(new Error('No rows were found...'));
        }
        done();
      });
    });

    it('should create a row in a spreadsheet', function (done) {
      var testRow = new TestRow();
      var suggestResource = suggestResourceInit(WORKSHEET_ID, spreadsheet, username, password);

      suggestResource(testRow, function (err, data) {
        if (err || !data) {
          throw (err);
        }
        should(data.username === testRow.username);
        done();
      });
    });

  });

});
