module.exports = function(config) {

  var mailer = require("webmaker-postalservice")({
    key: config.accessKeyId,
    secret: config.secretAccessKey
  });

  return {
    send_new_user_email: require("./create_user_emailer")(mailer),
    send_event_host_email: require("./create_event_emailer")(mailer),
    sign_up_for_bsd: require("./sign_up_for_bsd"),
    send_mofo_staff_email: require("./send_mofo_staff_email")(config.mofoStaffEmail, mailer)
  };
};
