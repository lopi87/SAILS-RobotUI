var sails = require('sails'),
    sinon = require('sinon'),
    assert = require('assert'),
    request = require('supertest');

// Global before hook
before(function (done) {
  // Lift Sails with test database
  this.timeout(500000000);

  sails.lift({
    log: {
      level: 'error'
    },
    models: {
      connection: 'test',
      migrate: 'drop'
    }
  }, function(err) {
    if (err)
      return done(err);

    // Load fixtures
    var barrels = new Barrels();

    // Save original objects in `fixtures` variable
    fixtures = barrels.data;

    // Populate the DB
    barrels.populate(function(err) {
      done(err, sails);
    });

  });
});

// Global after hook
after(function (done) {
  console.log(); // Skip a line before displaying Sails lowering logs
  Sails.lower(done);
});
