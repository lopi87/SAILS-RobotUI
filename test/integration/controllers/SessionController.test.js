
var request = require('supertest'),
  should = require('should');

describe('The Session controller', function() {

  describe('SessionController', function() {
    it('should redirect to robot/index_public_robots/', function (done) {
      var req = request.agent(sails.hooks.http.app);
      req.post("/session/create")
        .send( { email: 'test@test.com', password: '12345678' } )
        .expect(302)
        .expect('Location', '/robot/index_public_robots/')
        .end( function(err,res){
          if(err) throw err;
          console.log(res.text);
          done();
        })
    });
  });


  describe('Authenticated', function () {
    // use supertest.agent for store cookies ...
    // logged in agent
    var agent;
    // after authenticated requests login the user
    before(function (done) {
      agent = request.agent(sails.hooks.http.app);
      agent.post('/session/create')
        .send({
          email: 'test@test.com',
          password: '12345678'
        })
        .end(function (err) {
          done(err);
        });
    });


    it ('Index public robots', function () {
      agent
        .get('/robot/index_public_robots')
        .send()
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          should.exist(res.body);
          done();
        });
    });
  });
});





