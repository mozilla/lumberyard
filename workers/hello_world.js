module.exports = function(data, cb) {
  console.log("hello world");
  process.nextTick(cb);
};
