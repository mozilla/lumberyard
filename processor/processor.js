var AWS = require("aws-sdk");

var Processor = function Processor(config) {
  this._queueUrl = config.queueUrl
  this._sqs = new AWS.SQS({
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
    region: config.region
  })
};

Processor.prototype.fetch = function(cb) {
  this._sqs.receiveMessage({
    QueueUrl: this._queueUrl,
    WaitTimeSeconds: 20
  }, cb)
};

Processor.prototype.done = function(m, cb) {
  this._sqs.deleteMessage({
    QueueUrl: this._queueUrl,
    ReceiptHandle: m.ReceiptHandle
  }, cb);
};

module.exports = function(config) {
  return new Processor(config);
};
