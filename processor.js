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

  workers[m.data.event_type](m.data.data,function(err) {
    if ( err ) {
      console.log(err);
      return m.next();
    }

    m.delete(function(err) {
      if ( err ) {
        console.log(err);
      }

      m.next();
    });
  });
});
