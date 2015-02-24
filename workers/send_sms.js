var twilio = require("twilio");

module.exports = function(sid, authToken, from) {

  // disable if no config provided
  if ( !sid && !authToken && !from ) {
    return function(data, cb) {
      cb();
    }
  }

  var twilioClient = twilio(sid, authToken);

  return function(data, cb) {
    if ( !data.to ) {
      return cb(new Error("Missing required `to` param"));
    }

    if ( !data.body ) {
      return cb(new Error("Missing required `body` param"));
    }

    twilioClient.messages.create({
      body: data.body,
      to: data.to,
      from: from
    })
    .then(function() {
      cb();
    })
    .fail(cb);
  };
};
