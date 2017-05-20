var request = require('supertest'),
  should = require('should');

var FactoryGirl = require('factory_girl');
FactoryGirl.definitionFilePaths = [__dirname + '/factories'];
FactoryGirl.findDefinitions();


describe('The Session controller', function() {

  var user = FactoryGirl.create('user');

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


    it ('Action new', function () {
      request.agent(sails.hooks.http.app)
        .get('/action/create')
        .send()
        .expect(200)
        .end(function (err) {
          done(err);
        });
    });
  });
});
