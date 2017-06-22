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
          avatarUrl: require('util').format('/uploads/avatar/%s', user.id + '.' + extension)
        }).exec(function userUpdated(err, updated){
          if (err) {
            FlashService.error(req, 'Err');
            return;
          }
        });
      }
      return;
    }
    }, done );
  },


  // upload_robot_avatar: function(img, robot){
  //   img.upload({
  //     maxBytes: 10000000,
  //     adapter: require('skipper-gridfs'),
  //     uri: 'mongodb://127.0.0.1:27017/RobotUI.images',
  //     metadata: { robot: robot.id }
  //
  //   }, function (err, filesUploaded) {
  //     if (err) return;
  //
  //       Robot.update(robot.id, { avatarUrl: filesUploaded[0].fd }).exec(function updated(err, updated) {
  //         if (err) return res.negotiate(err);
  //         return;
  //       });
  //
  //     return;
  //   });
  // },
  //
  //
  //
  //
  // download_robot_avatar: function ( filename, res) {
  //   var blobAdapter = require('skipper-gridfs')({
  //     uri: 'mongodb://127.0.0.1:27017/RobotUI.images',
  //   });
  //
  //   blobAdapter.read(filename, function(error , file) {
  //     if(error) {
  //       res.json(error);
  //     } else {
  //       res.contentType('image/png');
  //       res.send(new Buffer(file));
  //     }
  //   });
  // },


  upload_robot_avatar: function(img, robot){

    img.upload({
      maxBytes: 10000000,
      dirname: require('path').resolve(sails.config.appPath, 'assets/images/robot_avatar')
    },function whenDone(err, uploadedFiles) {
      if (err) { return res.negotiate(err); }

      if (uploadedFiles.length === 0){
        return res.badRequest('No file was uploaded');
      }

      var filename = uploadedFiles[0].fd.split('/').pop();
      var uploadLocation = process.cwd() +'/assets/images/robot_avatar/' + filename;
      var tempLocation = process.cwd() + '/.tmp/public/images/robot_avatar/' + filename;

      fs.createReadStream(uploadLocation).pipe(fs.createWriteStream(tempLocation));

      Robot.update(robot.id, { avatarUrl: require('util').format('/images/robot_avatar/%s',  filename ) }).exec(function updated(err, updated) {
        if (err) return res.negotiate(err);
        return;
      });
    });
  },


  delete_file: function(element){
    var location = '.tmp/public' + element.avatarUrl;
    if (fs.existsSync(location)){
      //fs.unlinkSync(location);
    }
  }

};
