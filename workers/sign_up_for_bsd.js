var hyperquest = require("hyperquest");
var querystring = require("querystring");

module.exports = function(data, cb) {
  var signup = new Buffer(querystring.stringify({
    "custom-1216": 1,
    email: data.email
  }));

  var post = hyperquest.post({
    headers: {
      "Content-Length": signup.length,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    uri: "https://sendto.mozilla.org/page/s/webmaker"
  });

  post.on("error", cb);
  post.on("response", function(response) {
    // A successful subscription returns a 301
    if (response.statusCode !== 302) {
      return cb(new Error("Received a statusCode of: " + response.statusCode));
    }
    // Empty the response buffer.
    response.on("data", function() {});
    response.on("end", cb)
  });

  post.end(signup);
};
