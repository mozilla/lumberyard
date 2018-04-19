module.exports = function (transport) {

  return function (data, cb) {

    // Check required fields
    var errMessage = '';
    if (!data.html || typeof data.html !== 'string') {
      errMessage += 'Mailer: Missing "html" option. You must provide an email body as a string of html. ';
    }
    if (!data.from || typeof data.from !== 'string') {
      errMessage += 'Mailer: Missing "from" option. You must provide an email as a string. ';
    }
    if (!data.to || !(typeof data.to == 'string' || data.to.length)) {
      errMessage += 'Mailer: Missing "to" option. You must provide a list of emails as a string (comma-separated) or an array. ';
    }
    if (errMessage) {
      return cb(new Error(errMessage));
    }

    // Automatically generate plain text
    data.generateTextFromHTML = true;

    // Send if livemode is true, or if no livemode flag is indicated (backwards compatibility for other workers)
    if (!data.hasOwnProperty('livemode') || data.livemode) {
      transport.sendMail(data, cb);
    } else {
      console.log('Dumping email to console because livemode is disabled');
      console.log(`To: ${data.to}\nFrom: ${data.from}\nBody: ${data.html}`);
      cb();
    }
  };
};
