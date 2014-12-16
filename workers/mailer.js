module.exports = function (transport, validator) {

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

    validator.validate(data.to, function(err, res) {
      if (err) {
        return cb(new Error('Mailer: email "to" address could not be validated due to API call errors (' + err + '). '));
      }

      // When email validation fails we don't build an email, and we send a
      // signal that "everything has been handled correctly" by calling back.
      if (!res.is_valid) {
        return  cb(false, { messageId: 'Passed over due to bad "to:" address. ' });
      }

      // Automatically generate plain text
      data.generateTextFromHTML = true;

      // Send
      transport.sendMail(data, cb);
    });

  };
};
