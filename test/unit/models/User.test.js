require("sails-test-helper");

describe('User', function() {
  describe(".create()", function() {
    it("should be successful", function(done) {
      User.create().exec(function(err, user) {
        expect(err).to.not.exist;
        expect(user).to.exist;
        done();
      });
    });
  });
});
