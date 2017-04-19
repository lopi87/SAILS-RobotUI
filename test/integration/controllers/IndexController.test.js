var IndexController = require('../../../api/controllers/IndexController');

var request = require('supertest'),
  should = require('should');


describe('The Index Controller', function () {
  describe('when we load the about page', function () {
    it ('should render the view', function () {
      request(sails.hooks.http.app)
        .get('/index/about')
        .send()
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          should.exist(res.body);
          done();
        });
    });
  });

  describe('when we load the contact page', function () {
    it ('should render the view', function () {
      request(sails.hooks.http.app)
        .get('/index/contact')
        .send()
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          should.exist(res.body);
          done();
        });
    });
  });

  describe('when we load the index page', function () {
    it ('should render the view', function () {
      request(sails.hooks.http.app)
        .get('/index/index')
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

