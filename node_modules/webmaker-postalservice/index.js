var AWS = require("aws-sdk"),
    nunjucks = require("nunjucks"),
    nunjucksEnv = new nunjucks.Environment(
      new nunjucks.FileSystemLoader(__dirname + "/templates/"),
      { autoescape: true }
    ),
    premailer = require('premailer-api');

module.exports = function(options) {
  if (!options.key) {
    throw 'aws "key" required';
  }
  if (!options.secret) {
    throw 'aws "secret" required';
  }

  var ses = new AWS.SES({
    accessKeyId: options.key,
    secretAccessKey: options.secret
  });

  var templates = {
    createEventEmail: nunjucksEnv.getTemplate("create_event.html"),
    welcomeEmail: nunjucksEnv.getTemplate("welcome.html")
  };

  return {
    sendCreateEventEmail: function(options, callback) {
      var html = templates.createEventEmail.render({
        fullName: options.fullName
      });

      premailer.prepare({
        html: html
      }, function(err, email) {
        if (err) {
          return callback(err);
        }

        ses.sendEmail({
          Source: "events@webmaker.org",
          Destination: {
            ToAddresses: [options.to],
          },
          Message: {
            Subject: {
              Data: "Next steps for your event",
              Charset: "utf8"
            },
            Body: {
              Text: {
                Data: email.text,
                Charset: "utf8"
              },
              Html: {
                Data: email.html,
                Charset: "utf8"
              }
            }
          }
        }, callback);
      });
    },
    sendWelcomeEmail: function(options, callback) {
      var html = templates.welcomeEmail.render({
        fullName: options.fullName
      });

      premailer.prepare({
        html: html
      }, function(err, email) {
        if (err) {
          return callback(err);
        }

        ses.sendEmail({
          Source: "help@webmaker.org",
          Destination: {
            ToAddresses: [options.to],
          },
          Message: {
            Subject: {
              Data: "Welcome to Webmaker. Let's get you started.",
              Charset: "utf8"
            },
            Body: {
              Text: {
                Data: email.text,
                Charset: "utf8"
              },
              Html: {
                Data: email.html,
                Charset: "utf8"
              }
            }
          }
        }, callback);
      });
    }
  };
};
