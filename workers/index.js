module.exports = function(config) {
  var nodemailer = require("nodemailer");
  var sesTransport = require("nodemailer-ses-transport");
  var mailerTransport = nodemailer.createTransport(sesTransport({
    AWSAccessKeyID: config.accessKeyId,
    AWSSecretKey: config.secretAccessKey
  }));

  return {
    mailer: require("./mailer")(mailerTransport)
  };
};
