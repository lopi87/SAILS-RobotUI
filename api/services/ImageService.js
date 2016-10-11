//http://www.tysoncadenhead.com/blog/how-to-upload-remote-images-with-sails-js#.V6Mch16li1E

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
    img.upload({ maxBytes: 10000000, saveAs: function(file, cb){

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
          avatarUrl: require('util').format('%s/uploads/avatar/%s', sails.getBaseUrl(), user.id + '.' + extension)
        }).exec(function userUpdated(err, updated){
          if (err) {
            err = {err: 'Err'};
            FlashService.error(req, err);
            return;
          }
        });
      }
      cb(null, Path);

    }
    }, done );
  },



  upload_robot_avatar: function(img, robot, done){
    img.upload({ maxBytes: 10000000, saveAs: function(file, cb){

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
          avatarUrl: require('util').format('%s/uploads/robot_avatar/%s', sails.getBaseUrl(), robot.id + '.' + extension)
        }).exec(function robotUpdated(err, updated){
          if (err) {
            err = {err: 'Err'};
            FlashService.error(req, err);
            return;
          }
        });
      }
      cb(null, Path);

    }
    }, done );
  }



};



/*
Ejemplo de uso

 image.downloadFile(
 'http://www.google.com/intl/en_ALL/images/srpr/logo11w.png',
 './tmp/upload/googlelogo.png',
 function (data) {
 res.send(data);
 });
 */
