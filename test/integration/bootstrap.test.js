var sails = require('sails');

before(function (done) {
  // Lift Sails with test database
  this.timeout(500000000);

  sails.lift({
    log: {
      level: 'error'
    },
    models: {
      connection: 'someMongodbServer',
      migrate: 'drop'
    }
  }, function(err) {
    if (err)
      return done(err);

    sails.log.info('***** Starting tests... *****');
    console.log('\n');

    done(null, sails);
  });
});

after(function (done) {
  sails.lower(done);
});
