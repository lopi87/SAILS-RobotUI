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



  upload_avatar: function(img, user){

    img.upload({
      maxBytes: 10000000,
      dirname: require('path').resolve(sails.config.appPath, 'assets/images/avatar')
    },function whenDone(err, uploadedFiles) {
      if (err) { return res.negotiate(err); }

      if (uploadedFiles.length === 0){
        return res.badRequest('No file was uploaded');
      }

      var filename = uploadedFiles[0].fd.split('/').pop();
      var uploadLocation = process.cwd() +'/assets/images/avatar/' + filename;
      var tempLocation = process.cwd() + '/.tmp/public/images/avatar/' + filename;

      fs.createReadStream(uploadLocation).pipe(fs.createWriteStream(tempLocation));

      User.update(user.id, { avatarUrl: require('util').format('/images/avatar/%s',  filename ) }).exec(function updated(err, updated) {
        if (err) return res.negotiate(err);
        return;
      });
    });

  },


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
