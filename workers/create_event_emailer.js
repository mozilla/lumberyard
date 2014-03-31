module.exports = function(mailer) {
  return function(data, cb) {
    mailer.sendCreateEventEmail({
      fullName: data.username,
      to: data.email
    }, cb);
  };
};
