var twilio = require("twilio");

var twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

var from = process.env.TWILIO_FROM_NUMBER;

module.exports = function(data, cb) {
  if ( !data.to || !data.body ) {
    return cb(new Error("Missing required params for send_sms worker. to: " + !!data.to + ", body: " + !!data.body));
  }

  twilioClient.messages.create({
    body: data.body,
    to: data.to,
    from: from
  }).then(function() {
    cb();
  }).fail(function(error) {
    cb(new Error(error.message));
  });
};
