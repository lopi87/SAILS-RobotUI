var request = require('supertest'),
  should = require('should');

var FactoryGirl = require('factory_girl');
FactoryGirl.definitionFilePaths = [__dirname + '/factories'];
FactoryGirl.findDefinitions();


describe('The Video controller', function() {

  var video = FactoryGirl.create('video');

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


    it ('Video new', function () {
      request.agent(sails.hooks.http.app)
        .get('/video/create')
        .send()
        .expect(200)
        .end(function (err) {
          done(err);
        });
    });

    describe('#create()', function() {
      it('should create a video', function (done) {
        request.agent(sails.hooks.http.app)
          .post('/video/new')
          .send( video )
          .expect(302)
          .end(function(err, res){
            if(err){
              return done(err);
            }
            done();
          })
      });
    });

  });
});
