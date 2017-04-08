var request = require('supertest');

describe('SessionController', function() {

  describe('#index()', function() {
    it('should Forbidden', function (done) {
      request(sails.hooks.http.app)
        .post('/user/index')
        .send()
        .expect(403)
        .end(done)
    });
  });

});
