var AWS = require("aws-sdk"),
    nunjucks = require("nunjucks"),
    nunjucksEnv = new nunjucks.Environment(
      new nunjucks.FileSystemLoader(__dirname + "/templates/"),
      { autoescape: true }
    ),
    premailer = require('premailer-api'),
    i18n = require('webmaker-i18n'),
    path = require('path');

// Setup locales with i18n
i18n.middleware({
  supported_languages: ['*'],
  default_lang: "en-US",
  translation_directory: path.resolve(__dirname, "locale")
});

nunjucksEnv.addFilter("instantiate", function (input) {
  var tmpl = new nunjucks.Template(input);
  return tmpl.render(this.getVariables());
});

function isLanguageSupport(locale) {
  return i18n.getSupportLanguages().indexOf(locale) !== -1;
};

module.exports = function(options) {
  if (!options.key) {
    throw 'aws "key" required';
  }
  if (!options.secret) {
    throw 'aws "secret" required';
  }

  var webmakerURL = options.webmakerURL || 'https://webmaker.org';

  var ses = new AWS.SES({
    accessKeyId: options.key,
    secretAccessKey: options.secret
  });

  var templates = {
    createEventEmail: nunjucksEnv.getTemplate("create_event.html"),
    mofoStaffEmail: nunjucksEnv.getTemplate("mofo_staff_new_event.html"),
    welcomeEmail: nunjucksEnv.getTemplate("welcome.html"),
    badgeAwarded: nunjucksEnv.getTemplate("badge_awarded.html"),
    badgeAwardedSuperMentor: nunjucksEnv.getTemplate("badge_awarded_super_mentor.html")
  };

  return {
    sendCreateEventEmail: function(options, callback) {
      options.locale = isLanguageSupport(options.locale) ? options.locale : "en-US";
      var html = templates.createEventEmail.render({
        fullName: options.fullName,
        gettext: i18n.getStrings(options.locale),
        locale: options.locale
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
              Data: i18n.gettext("Next steps for your event", options.locale),
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
    sendBadgeAwardedEmail: function(options, callback) {
      options.locale = isLanguageSupport(options.locale) ? options.locale : "en-US";

      // Use the right template
      var template;
      var subject;
      var from;

      if (options.badge.slug === 'webmaker-super-mentor') {
        template = 'badgeAwardedSuperMentor';
        subject = 'badgeAwardedSuperMentorSubject';
        from = 'Michelle Thorne <help@webmaker.org>';
      } else {
        template = 'badgeAwarded';
        subject = 'badgeAwardedSubject';
        from = 'help@webmaker.org';
      }

      var html = templates[template].render({
        email: options.email,
        badge: options.badge,
        comment: options.comment,
        gettext: i18n.getStrings(options.locale),
        locale: options.locale,
        webmakerURL: webmakerURL
      });

      premailer.prepare({
        html: html
      }, function(err, email) {
        if (err) {
          return callback(err);
        }

        ses.sendEmail({
          Source: from,
          Destination: {
            ToAddresses: [options.to]
          },
          Message: {
            Subject: {
              Data: i18n.gettext(subject, options.locale),
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
      options.locale = isLanguageSupport(options.locale) ? options.locale : "en-US";
      var html = templates.welcomeEmail.render({
        fullName: options.fullName,
        gettext: i18n.getStrings(options.locale),
        locale: options.locale
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
            ToAddresses: [options.to]
          },
          Message: {
            Subject: {
              Data: i18n.gettext("emailTitle", options.locale),
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
    sendMofoStaffEmail: function(options, callback) {
      var html = templates.mofoStaffEmail.render({
        email: options.email,
        username: options.username,
        eventId: options.eventId
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
            ToAddresses: [options.to]
          },
          Message: {
            Subject: {
              Data: "A new event was created",
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
