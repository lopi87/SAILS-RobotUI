require("sails-test-helper");
var FactoryGirl = require('factory_girl');

describe('The Session controller', function() {


  FactoryGirl.define('user', function() {
    this._id = '591f3a05ac59629c25d73c3c';
    this.name = 'Bob';
    this.email = 'test@test.com';
    this.encryptedPassword = "$2a$10$AKIaQSIcjQhdBBNKHt0K6uRMGeoL2D1fP.8dnbwE4Q.YCkHNKsVk.";
    this.language = 'ES';
  });

  //   // factory.define("admin_user", "Admin").parent("user").attr("admin", true);
  //
  //   // var user = factory.create("user");

  it('should fail accessing to a robot/index_public_robots/ page before login', function (done) {
    request.get('/robot/index_public_robots/')
      .expect(403)
      .end(done)
  });


  describe("GET index", function() {
    before(function(done) {
      User.count(function(err, count) {
        expect(err).to.not.exist;
        expect(count).to.be.greaterThan(0);
        done();
      });
    });
  });


  describe('SessionController', function() {
    it('should redirect to robot/index_public_robots/ after login', function (done) {
      request.post("/session/create")
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


    before(function (done) {
      request.post('/session/create')
        .send({
          email: 'test@test.com',
          password: '12345678'
        })
        .end(function (err) {
          done(err);
        });
    });


    it ('Index public robots', function () {
      request.get('/robot/index_public_robots')
        .send()
        .expect(200)
        .end(function (err) {
          done(err);
        });
    });
  });
});
