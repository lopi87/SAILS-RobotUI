var request = require('supertest'),
  should = require('should');

var FactoryGirl = require('factory_girl');
FactoryGirl.definitionFilePaths = [__dirname + '/factories'];
FactoryGirl.findDefinitions();


describe('The Session controller', function() {

  var user = FactoryGirl.create('user');

  it('should fail accessing to a robot/index_public_robots/ page before login', function (done) {
    request.agent(sails.hooks.http.app).get('/robot/index_public_robots/')
      .expect(403)
      .end(done)
  });


  describe('SessionController', function() {
    it('should redirect to robot/index_public_robots/ after login', function (done) {
      request.agent(sails.hooks.http.app)
        .post("/session/create")
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
      request.agent(sails.hooks.http.app)
      .post('/session/create')
      .send({
          email: 'test@test.com',
          password: '12345678'
      })
      .end(function (err) {
          done(err);
      });
    });


    it ('Index public robots', function () {
      request.agent(sails.hooks.http.app)
        .get('/robot/index_public_robots')
        .send()
        .expect(200)
        .end(function (err) {
          done(err);
        });
    });
  });
});
