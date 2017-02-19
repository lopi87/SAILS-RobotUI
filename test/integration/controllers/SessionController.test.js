var IndexController = require('../../../api/controllers/IndexController'),
  sinon = require('sinon'),
  assert = require('assert');

describe('SessionController', function() {

  describe('#create()', function() {
    it('should redirect to robot/index_public_robots/', function (done) {
      request(sails.hooks.http.app)
        .post('/sessions/create')
        .send({ email: 'er_lope@hotmail.com', password: '12345678' })
        .expect(302)
        .expect('location','/robot/index_public_robots/', done);
    });
  });

});
