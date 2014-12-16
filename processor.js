if (process.env.NEW_RELIC_ENABLED) {
  require("newrelic");
}

var SQSProcessor = require("sqs-processor");

var queue = new SQSProcessor({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_QUEUE_REGION,
  queueUrl: process.env.INCOMING_QUEUE_URL,
  debug: process.env.DEBUG === 'true'
});

var workers = require("./workers")({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  webmakerURL: process.env.WEBMAKER_URL,
  googleUsername: process.env.GOOGLE_USERNAME,
  googlePassword: process.env.GOOGLE_PASSWORD,
  mailgunAPIKey: process.env.MAILGUN_API_KEY
});

queue.startPolling(
  function worker(message, callback) {
    if (!workers[message.event_type]) {
      var workerNotFoundError = new Error("No worker available to process '" + message.event_type + "'");
      workerNotFoundError.data = message.data;
      return callback(workerNotFoundError);
    }

    workers[message.event_type](message.data, function(workerError) {
      if (workerError) {
        workerError.from = "workers[" + message.event_type + "]";
        workerError.data = message.data;
        return callback(workerError);
      }

      callback();
    });
  },
  function error(poll_error) {
    console.log(poll_error);
    console.log(poll_error.stack);
    process.exit(1);
  }
);

var shutdown_handler = function() {
  queue.stopPolling(function() {
    console.log("polling terminated");
    process.exit(0);
  });
};

// Heroku's dyno manager sends SIGTERM when requesting dyno shut down, Ctrl-C sends SIGINT
process.on("SIGTERM", shutdown_handler);
process.on("SIGINT", shutdown_handler);
