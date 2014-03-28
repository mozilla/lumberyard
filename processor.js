var processor = require("./processor/processor")({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_QUEUE_REGION,
  queueUrl: process.env.AWS_QUEUE_URL
});

var workers = require("./workers");

var async = require("async");

var queue = async.queue(function(message, queue_done) {
  async.waterfall([
    function(w_done) {
      w_done(null, message);
    },
    workers.create_user_emailer({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    })
  ], function(err) {
    if (err) {
      throw err;
    }

    processor.done(message, queue_done);
  });
}, 1);

async.forever(function(next) {
  processor.fetch(function(err, messages) {
    if (err) {
      return next(err);
    }

    if (messages.Messages) {
      messages.Messages = messages.Messages.map(function(m) {
        m.ParsedBody = JSON.parse(m.Body);
        return m;
      });
      queue.push(messages.Messages);
      queue.drain = next;
    } else {
      next();
    }
  });
}, function(err) {
  if (err) {
    throw err;
  }
});
