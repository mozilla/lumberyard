var should = require('should');

describe('Mailer', function() {
  var nodemailer = require('nodemailer');
  var mailerInit = require('../workers/mailer');
  var StdoutTransport = require('./utils/stdoutTransport');

  var mockTransport = nodemailer.createTransport(StdoutTransport, {
    name: "0.0.0.0" // hostname for generating Message-ID values
  });
  var mailer = mailerInit(mockTransport);

  function TestInstance() {
    this.from = 'kate@kate.com';
    this.to = ['bob@b4324dasweasd.com', 'laura@lau3242dasdaw2dra.com'];
    this.subject = 'OMG!!';
    this.html = '<h1>Wow</h1><p>It\'s working</p>';
  }

  describe('#mailer(data, callback)', function() {

    it('should send an email', function (done) {
      var testMailInstance = new TestInstance();

      mailer(testMailInstance, function (err, resp) {
        if (err) {
          throw err;
        }
        resp.should.have.property('messageId');
        done();
      });
    });

    it('should throw an error when "to" field is missing', function (done) {
      var testMailInstance = new TestInstance();
      testMailInstance.to = null;

      mailer(testMailInstance, function (err, resp) {
        err.should.be.an.Error;
        err.message.should.be.equal('Mailer: Missing "to" option. You must provide a list of emails as a string (comma-separated) or an array. ');
        done();
      });
    });

    it('should throw an error when "to" field is not a string or an array', function (done) {
      var testMailInstance = new TestInstance();
      testMailInstance.to = { email: 'hello@world.com' };

      mailer(testMailInstance, function (err, resp) {
        err.should.be.an.Error;
        err.message.should.be.equal('Mailer: Missing "to" option. You must provide a list of emails as a string (comma-separated) or an array. ');
        done();
      });
    });

    it('should throw an error when "from" field is missing', function (done) {
      var testMailInstance = new TestInstance();
      testMailInstance.from = null;

      mailer(testMailInstance, function (err, resp) {
        err.should.be.an.Error;
        err.message.should.be.equal('Mailer: Missing "from" option. You must provide an email as a string. ');
        done();
      });
    });

    it('should throw an error when "from" field is not a string', function (done) {
      var testMailInstance = new TestInstance();
      testMailInstance.from = ['adsd@dasdad.com'];

      mailer(testMailInstance, function (err, resp) {
        err.should.be.an.Error;
        err.message.should.be.equal('Mailer: Missing "from" option. You must provide an email as a string. ');
        done();
      });
    });

    it('should throw an error when "html" field is missing', function (done) {
      var testMailInstance = new TestInstance();
      testMailInstance.html = null;

      mailer(testMailInstance, function (err, resp) {
        err.should.be.an.Error;
        err.message.should.be.equal('Mailer: Missing "html" option. You must provide an email body as a string of html. ');
        done();
      });
    });

    it('should throw an error when "html" field is not a string', function (done) {
      var testMailInstance = new TestInstance();
      testMailInstance.html = ['<p></p>'];

      mailer(testMailInstance, function (err, resp) {
        err.should.be.an.Error;
        err.message.should.be.equal('Mailer: Missing "html" option. You must provide an email body as a string of html. ');
        done();
      });
    });

  });

});
