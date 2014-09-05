if (process.env.NEW_RELIC_ENABLED) {
  require("newrelic");
}

var async = require("async");
var AWS = require("aws-sdk");

var debug = function() {
  if (process.env.DEBUG === 'true') {
    console.log.apply(null, arguments);
  }
}

var queue = new AWS.SQS({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_QUEUE_REGION
});

var workers = require("./workers")({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  webmakerURL: process.env.WEBMAKER_URL,
  googleUsername: process.env.GOOGLE_USERNAME,
  googlePassword: process.env.GOOGLE_PASSWORD
});

async.forever(function(callback) {
  debug("requesting a message");
  queue.receiveMessage({
    MaxNumberOfMessages: 1,
    QueueUrl: process.env.INCOMING_QUEUE_URL,
    WaitTimeSeconds: 20
  }, function(receiveError, data) {
    if (receiveError) {
      receiveError.from = "queue.recieveMessage()";
      return callback(receiveError);
    }

    if (!data || !Array.isArray(data.Messages) || data.Messages.length !== 1) {
      debug("no messages found");
      return callback();
    }

    var message, receiptHandle;
    try {
      message = JSON.parse(data.Messages[0].Body);
      receiptHandle = data.Messages[0].ReceiptHandle
    } catch (jsonError) {
      jsonError.data = data.Messages[0].Body;
      return callback(jsonError);
    }

    if (!workers[message.event_type]) {
      var workerNotFoundError = new Error("No worker available to process '" + message.event_type + "'");
      workerNotFoundError.data = message.data;
      return callback(workerNotFoundError);
    }

    debug("processing %j", message);

    workers[message.event_type](message.data, function(workerError) {
      if (workerError) {
        workerError.from = "workers[" + message.event_type + "]";
        workerError.data = message.data;
        return callback(workerError);
      }

      debug("deleting a message");

      queue.deleteMessage({
        QueueUrl: process.env.INCOMING_QUEUE_URL,
        ReceiptHandle: receiptHandle
      }, function(deleteErr) {
        if (deleteErr) {
          deleteErr.from = "queue.deleteMessage()";
          return callback(deleteErr);
        }

        debug("message deleted");

        callback();
      });
    });
  });
}, function(closeError) {
  if (closeError) {
    console.log("%j", closeError);
    console.log("%s", closeError.stack);
  }

  process.exit(1);
});
