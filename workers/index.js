module.exports = function(config) {

  // For old mailers
  var mailer = require("webmaker-postalservice")({
    key: config.accessKeyId,
    secret: config.secretAccessKey,
    webmakerURL: config.webmakerURL
  });

  // For new mailer
  var mailerTransport = require("nodemailer").createTransport("SES", {
    AWSAccessKeyID: config.accessKeyId,
    AWSSecretKey: config.secretAccessKey
  });

  // For mail address validation
  var emailValidator = require('mailgun-validator')(config.mailgunAPIKey);

  return {
    mailer: require("./mailer")(mailerTransport, emailValidator),
    sign_up_for_bsd: require("./sign_up_for_bsd"),
    badge_awarded_send_email: require("./badge_awarded_send_email")(mailer),
    google_spreadsheet: require("./google_spreadsheet")(config.googleUsername, config.googlePassword),
    hello_world: require("./hello_world")
  };
};
