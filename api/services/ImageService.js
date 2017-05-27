var gm = require('gm'),
    fs = require('fs'),
    request = require('request');

module.exports = {

  downloadFile: function (uri, fileName, done) {
    request.head(uri, function (err, res, body) {
      request(uri).pipe(fs.createWriteStream(fileName)).on('close', done);
    });
  },

  resize: function (srcPath, dstPath, width, done) {
    gm(srcPath)
      .options({imageMagick: true})
      .resize(width)
      .write(dstPath, done);
  },

  process: function (uri, fileName, done) {
    var self = this;
    this.downloadFile(uri, fileName, function () {
      self.resize(fileName, fileName, 200, done);
    });
  },



  upload_avatar: function(img, user, done){
    img.upload({ maxBytes: 2500, saveAs: function(file, cb){

        // setting allowed file types
      var allowedTypes = ['image/jpeg', 'image/png'];
      var Path = '../../.tmp/public/uploads/avatar/disallowed.disallowed';


      // seperate allowed and disallowed file types
      if(allowedTypes.indexOf(file.headers['content-type']) != -1 && file.length != 0) {
        var extension = file.filename.split('.').pop();
        Path = '../../.tmp/public/uploads/avatar/' + user.id + '.' + extension;

        // Save the url where the avatar for a user can be accessed
        User.update(user.id, {
          // Generate a unique URL where the avatar can be downloaded.
          avatarUrl: require('util').format('/uploads/avatar/%s', user.id + '.' + extension)
        }).exec(function userUpdated(err, updated){
          if (err) {
            FlashService.error(req, 'Err');
            return;
          }
        });
      }
      cb(null, Path);

    }
    }, done );
  },



  upload_robot_avatar: function(img, robot, done){
    img.upload({ maxBytes: 2500, saveAs: function(file, cb){

      // setting allowed file types
      var allowedTypes = ['image/jpeg', 'image/png'];
      var Path = '../../.tmp/public/uploads/robot_avatar/disallowed.disallowed';


      // seperate allowed and disallowed file types
      if(allowedTypes.indexOf(file.headers['content-type']) != -1 && file.length != 0) {
        var extension = file.filename.split('.').pop();
        Path = '../../.tmp/public/uploads/robot_avatar/' + robot.id + '.' + extension;

        // Save the url where the avatar for a user can be accessed
        Robot.update(robot.id, {
          // Generate a unique URL where the avatar can be downloaded.
          avatarUrl: require('util').format('/uploads/robot_avatar/%s', robot.id + '.' + extension)
        }).exec(function robotUpdated(err, updated){
          if (err) {
            FlashService.error(req, 'Err');
            return;
          }
          return cb(null, Path);
        });
      }
    }
    }, done );
  },

  upload_robot_documentation: function(img, robot, done){
    img.upload({ maxBytes: 2500, saveAs: function(file, cb){

      // setting allowed file types
      var allowedTypes = ['application/pdf'];
      var Path = '../../.tmp/public/uploads/robot_documentation/disallowed.disallowed';

      // seperate allowed and disallowed file types
      if(allowedTypes.indexOf(file.headers['content-type']) != -1 && file.length != 0) {
        var extension = file.filename.split('.').pop();
        Path = '../../.tmp/public/uploads/robot_documentation/' + robot.id + '.' + extension;

        // Save the url where the avatar for a user can be accessed
        Robot.update(robot.id, {
          // Generate a unique URL where the avatar can be downloaded.
          avatarUrl: require('util').format('/uploads/robot_documentation/%s', robot.id + '.' + extension)
        }).exec(function robotUpdated(err, updated){
          if (err) {
            FlashService.error(req, 'Err');
            return;
          }

          return cb(null, Path);
        });
      }
    }
    }, done );
  },


  delete_file: function(element){
    var location = '.tmp/public' + element.avatarUrl;
    if (fs.existsSync(location)){
      fs.unlinkSync(location);
    }
  }


};
