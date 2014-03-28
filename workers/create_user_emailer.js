module.exports = function(config) {
  var mailer = require("webmaker-postalservice")({
    key: config.accessKeyId,
    secret: config.secretAccessKey
  });

  return function(m, cb) {
    if (m.ParsedBody.event_type !== "create_user") {
      return cb(null, m);
    }

    mailer.sendWelcomeEmail({
      fullName: m.ParsedBody.data.username,
      to: m.ParsedBody.data.email
    }, cb);
  };
};
