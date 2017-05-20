var Sails = require('sails');
var _ = require('lodash');

global.DOMAIN = 'http://localhost';
global.PORT = 1337;
global.HOST = DOMAIN + ':' + PORT;

before(function(callback) {
  this.timeout(7000);

  var configs = {
    log: {
      level: 'info'
    },
    models: {
      connection: 'testMongodbServer'
    },
    port: PORT,
    // environment: 'test',

    // @TODO needs suport to csrf token
    csrf: false
  };

  Sails.load(configs, function(err, sails) {
    if (err) {
      console.error(err);
      return callback(err);
    }

    sails.log.info('***** Starting tests *****');
    console.log('\n');

    // here you can load fixtures, etc.
    callback(err, sails);
  });
});

after(function(done) {
// here you can clear fixtures, etc.
  sails.lower(done);
});

//
//
// var Sails = require('sails');
// var _ = require('lodash');
//
// global.DOMAIN = 'http://localhost';
// global.PORT = 1337;
// global.HOST = DOMAIN + ':' + PORT;
//
// before(function(callback) {
//   this.timeout(7000);
//
//   var configs = {
//     log: {
//       level: 'info'
//     },
//
//     connections: {
//       memory: {
//         // lets use memory tests ...
//         adapter   : 'sails-memory'
//       }
//     },
//     models: {
//       connection: 'memory'
//     },
//
//     port: PORT,
//     // environment: 'test',
//
//     // @TODO needs suport to csrf token
//     csrf: false
//   };
//
//   Sails.load(configs, function(err, sails) {
//     if (err) {
//       console.error(err);
//       return callback(err);
//     }
//
//     sails.log.info('***** Starting tests *****');
//     console.log('\n');
//
//     // here you can load fixtures, etc.
//     callback(err, sails);
//   });
// });
//
// after(function(done) {
// // here you can clear fixtures, etc.
//   sails.lower(done);
// });
