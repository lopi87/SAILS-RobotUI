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



var fs = require('fs'), path = require('path');

module.exports.bootstrap = function(cb) {

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  Session.destroy({}).exec(function (err) {
    // Room.destroy({}).exec(function (err) {
      User.update({online: true}, {online: false}).exec(function (err){
        Robot.update({busy: true}, {busy: false}).exec(function (err){
          Robot.update({online: true}, {online: false}).exec(function (err) {
            cb();
          });
        });
      });
    // });
  });

  fs.lstat('.tmp/public/images/robot_avatar', function(err) {cb(err); });
  fs.lstat('.tmp/public/images/avatar', function(err) {cb(err); });

  fs.symlink('avatars/robots', '.tmp/public/images/robot_avatar', 'dir', function(err) { cb(err); });
  fs.symlink('avatars/users', '.tmp/public/images/avatar', 'dir', function(err) { cb(err); });


  // var robotsSource = path.join(process.cwd(), 'avatars/robots')
  //   , robotsDest = path.join(process.cwd(), '.tmp/public/avatars/robots');
  //
  // var usersSource = path.join(process.cwd(), 'avatars/users')
  //   , usersDest = path.join(process.cwd(), '.tmp/public/avatars/users');
  //
  // fs.symlink(robotsSource, robotsDest, function(err) {
  //   cb(err);
  // });
  //
  // fs.symlink(usersSource, usersDest, function(err) {
  //   cb(err);
  // });
};
