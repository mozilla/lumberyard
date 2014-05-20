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

  return {
    mailer: require("./mailer")(mailerTransport),
    send_new_user_email: require("./create_user_emailer")(mailer),
    send_event_host_email: require("./create_event_emailer")(mailer),
    sign_up_for_bsd: require("./sign_up_for_bsd"),
    send_mofo_staff_email: require("./send_mofo_staff_email")(config.mofoStaffEmail, mailer),
    badge_awarded_send_email: require("./badge_awarded_send_email")(mailer)
  };
};
