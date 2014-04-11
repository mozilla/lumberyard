module.exports = function(mofoStaffEmail, mailer) {
  return function(data, cb) {
    mailer.sendMofoStaffEmail({
      username: data.username,
      email: data.email,
      eventId: data.eventId,
      locale: data.locale,
      to: mofoStaffEmail
    }, cb);
  };
};
