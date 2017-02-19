var UserController = require('../../../api/controllers/UserController'),
  sails = require('sails'),
  sinon = require('sinon'),
  assert = require('assert'),
  request = require('supertest');

describe('UserController', function() {

    it ('should render the index view', function () {
      var view = sinon.spy();
      UserController.index(null, {
        view: view
      });
      assert.ok(view.called);
    });


});

