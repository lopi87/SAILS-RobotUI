var IndexController = require('../../../api/controllers/IndexController'),
  sinon = require('sinon'),
  assert = require('assert');

describe('The Index Controller', function () {
  describe('when we load the about page', function () {
    it ('should render the view', function () {
      var view = sinon.spy();
      IndexController.about(null, {
        view: view
      });
      assert.ok(view.called);
    });
  });

  describe('when we load the contact page', function () {
    it ('should render the view', function () {
      var view = sinon.spy();
      IndexController.contact(null, {
        view: view
      });
      assert.ok(view.called);
    });
  });

  describe('when we load the index page', function () {
    it ('should render the view', function () {
      var view = sinon.spy();
      IndexController.index(null, {
        view: view
      });
      assert.ok(view.called);
    });
  });

});

