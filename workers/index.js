module.exports = function(config) {

  // For old mailers
  var mailer = require("webmaker-postalservice")({
    key: config.accessKeyId,
    secret: config.secretAccessKey,
    webmakerURL: config.webmakerURL
  });

  // For new mailer
  var nodemailer = require("nodemailer");
  var sesTransport = require("nodemailer-ses-transport");
  var mailerTransport = nodemailer.createTransport(sesTransport({
    AWSAccessKeyID: config.accessKeyId,
    AWSSecretKey: config.secretAccessKey
  }));

  // For mail address validation
  var emailValidator = require('mailgun-validator')(config.mailgunAPIKey);

  return {
    mailer: require("./mailer")(mailerTransport, emailValidator),
    sign_up_for_webmaker_mailing_list: require("./sign_up_for_webmaker_mailing_list"),
    badge_awarded_send_email: require("./badge_awarded_send_email")(mailer),
    google_spreadsheet: require("./google_spreadsheet")(config.googleUsername, config.googlePassword),
    hello_world: require("./hello_world"),
    send_sms: require("./send_sms")(config.twilioSid, config.twilioAuthToken, config.twilioFrom)
  };
};
