
var gakki = require("../scripts/script.js");

module.exports = {
  testFunction: function(test) {
    test.equal(123, 123);
    test.done();
  },
  anotherTestFunction: function(test) {
    test.notEqual(123, 5566);
    test.ok("123" == "123");
    test.done();
  },
  yetAnotherTestFunction: function(test) {
    test.expect(1);
    test.equal(5566, 5566);
    test.done();
  }
};
