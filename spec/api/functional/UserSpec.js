// spec/api/functional/IndexSpec.js

var should = require('should');

describe('Users', function(){

  function clear() {
    wolfpack.clearResults();
    wolfpack.clearErrors();
  }

  beforeEach(clear);

  describe('Authenticated', function () {
    before(function (done) {
      request.agent(server)
        .post('/session/create')
        .send({
          email: 'test@test.com',
          password: '12345678'
        })
        .end(function (err, res) {
          // Save the cookie to use it later to retrieve the session
          Cookies = res.headers['set-cookie'].pop().split(';')[0];

          done();
        });
    });

    it("should return an array of users", function(done){
      wolfpack.setFindResults(fixtures.users);

      var req = request(server);
      // Set cookie to get saved user session
      req.cookies = Cookies;

      req.session = '';
      req.session.User = fixtures.users.first;
      console.log(fixtures.users);

      req
        .get('/user/index')
        .send()
        .expect(200)
        .end(function (err) {
          done(err);
        });
    });
  });
});
