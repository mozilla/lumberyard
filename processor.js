var workers = require("./workers")({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  mofoStaffEmail: process.env.MOFO_STAFF_EMAIL,
  webmakerURL: process.env.WEBMAKER_URL,
  googleUsername: process.env.GOOGLE_USERNAME,
  googlePassword: process.env.GOOGLE_PASSWORD
});

var SqsQueueParallel = require('sqs-queue-parallel');
var config = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  name: process.env.INCOMING_QUEUE_NAME,
  region: process.env.AWS_QUEUE_REGION,
  debug: process.env.DEBUG
};

var queue = new SqsQueueParallel(config);

queue.on("message", function(m) {
  if (!workers[m.data.event_type] || !m.data.data) {
    return m.next();
  }

  workers[m.data.event_type](m.data.data, function(err) {
    if (config.debug) {
      console.log('LUMBERYARD EVENT [' + m.data.event_type + ']: %j', m.data.data);
    }

    if ( err ) {
      console.log("Error from %s worker:\n%s", m.data.event_type, err.stack);
      return m.next();
    }

    m.deleteMessage(function(err) {
      if ( err ) {
        console.log("Error deleting message:\n%s", err.stack);
      }

      m.next();
    });
  });
});
