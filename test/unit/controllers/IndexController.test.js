require("sails-test-helper");

describe('The Index Controller', function () {
  describe('when we load the about page', function () {
    it ('should render the view', function (done) {
      request.get('/index/about')
        .send()
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          done();
        });
    });
  });

  describe('when we load the contact page', function () {
    it ('should render the view', function () {
      request.get('/index/contact')
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
      request.get('/index/index')
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

