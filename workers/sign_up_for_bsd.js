var hyperquest = require("hyperquest");
var querystring = require("querystring");

module.exports = function(data, cb) {
  var post = hyperquest.post({
    headers: {
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

  var signup = querystring.stringify({
    "custom-1216": 1,
    email: data.email
  });

  post.end(new Buffer(signup));
};
