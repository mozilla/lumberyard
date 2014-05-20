// This transport pipes emails to stdout.
// It is useful for tests

function StdoutTransport(options) {
  this.options = options;
}

StdoutTransport.prototype.sendMail = function (emailMessage, callback) {
  console.log("Envelope: ", emailMessage.getEnvelope());
  emailMessage.pipe(process.stdout);
  emailMessage.on("error", function(err) {
    callback(err);
  });
  emailMessage.on("end", function() {
    callback(null, {
      messageId: emailMessage._messageId
    });
  });
  // everything set up, start streaming
  emailMessage.streamMessage();
};

StdoutTransport.prototype.close = function (closeCallback) {};


module.exports = StdoutTransport;
