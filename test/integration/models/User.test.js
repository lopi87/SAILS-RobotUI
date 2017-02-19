var User = require('../../../api/models/User'),
  sinon = require('sinon'),
  assert = require('assert');

describe('The User Model', function () {
  describe('before the user is created', function () {
    it ('should hash the password', function (done) {
      User.beforeCreate({
        password: 'password',
        confirmation: 'password'
      }, function (err, user) {
        assert.notEqual(user.encryptedPassword, 'password');
        assert.notEqual(user.encryptedPassword, null);
        done();
      });
    });
  });


  it ('Password doesnt match password confirmation.', function (done) {
    User.beforeCreate({
      password: 'password',
      confirmation: 'different password'
    }, function (err, user) {
    });
  });


});
