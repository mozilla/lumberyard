var hyperquest = require("hyperquest");
var querystring = require("querystring");

module.exports = function(data, cb) {
  var signup = new Buffer(querystring.stringify({
    email: data.email,
    locale: data.locale,
    newsletters: 'webmaker',
    trigger_welcome: 'N'
  }));

  var post = hyperquest.post({
    headers: {
      "Content-Length": signup.length,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    uri: "https://basket.mozilla.org/news/subscribe/"
  });

  post.on("error", cb);
  post.on("response", function(response) {
    // A successful subscription returns a 200
    if (response.statusCode !== 200) {
      return cb(new Error("Received a statusCode of: " + response.statusCode));
    }
    // Empty the response buffer.
    response.on("data", function() {});
    response.on("end", cb)
  });

  post.end(signup);
};
