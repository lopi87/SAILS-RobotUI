var request = require('supertest'),
  should = require('should');


var Session = require('supertest-session')({
  app: require('../../../app')
});


var FactoryGirl = require('factory_girl');
FactoryGirl.definitionFilePaths = [__dirname + '/factories'];
FactoryGirl.findDefinitions();


describe('The Action controller', function() {

  var action = FactoryGirl.create('action');

  describe('Authenticated', function () {
    before(function (done) {
      //this.sess = new Session();

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

    describe('#create()', function() {
      it('should create an action', function (done) {
        request.agent(sails.hooks.http.app)
          .post('/action/newaction')
          .send( action )
          .expect(302)
          .end(function (err) {
            done(err);
          });
      });
    });

  });
});
