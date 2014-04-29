module.exports = function(mailer) {
  return function(data, cb) {
    mailer.sendBadgeAwardedEmail({
      user: data.user,
      badge: data.badge,
      locale: data.locale,
      to: data.email
    }, cb);
  };
};
