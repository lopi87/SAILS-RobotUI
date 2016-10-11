/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function(cb) {

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  Session.destroy({}).exec(function (err) {
    Room.destroy({}).exec(function (err) {
      User.update({online: true}, {online: false}).exec(function (err){
        Robot.update({busy: true}, {busy: false}).exec(function (err){
        });
      });
    });
  });


  cb();
};
