const factory = require('factory-girl').factory;

var request = require('supertest'),
  should = require('should');

var user = factory.build('user');

describe('The User controller', function() {

  describe('#index()', function() {
    it('should Forbidden', function (done) {
      request(sails.hooks.http.app)
        .get('/user/index')
        .send()
        .expect(403)
        .end(done)
    });
  });


  describe('#sign_up()', function() {
    it('should get data', function (done) {
      request(sails.hooks.http.app)
        .get('/user/new')
        .send()
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          should.exist(res.body);
          done();
        });
    });
  });

  describe('#create()', function() {
    it('should create an user', function (done) {
      request(sails.hooks.http.app)
        .post('/user/create')
        .send( user )
        .expect(302)
        .end(function(err, res){
          if(err){
            return done(err);
          }
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
      request(sails.hooks.http.app)
        .get('/robot/index_public_robots')
        .send()
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          should.exist(res.body);
          done();
        });
    });


    it('Test update /user/update/:user_id', function(done){
      request.agent(sails.hooks.http.app)
        .put('/user/update/591f3a05ac59629c25d73c3c')
        .send( user )
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          should.exist(res.body);
          done();
        });
    });

    describe('#show()', function() {
      it('should show an user', function (done) {
        console.log(user.id);

        request(sails.hooks.http.app)
          .get('/user/show/591f3a05ac59629c25d73c3c' )
          .send({ id: user.id })
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err);
            should.exist(res.body);
            done();
          });
      });
    });


  });
});
