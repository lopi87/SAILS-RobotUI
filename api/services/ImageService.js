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
    img.upload({
      // don't allow the total upload size to exceed ~10MB
      maxBytes: 10000000,
      saveAs: function(file, cb){

        // setting allowed file types
        var allowedTypes = ['image/jpeg', 'image/png'];

        var extension = file.filename.split('.').pop();

        // seperate allowed and disallowed file types
        if(allowedTypes.indexOf(file.headers['content-type']) === -1) {
          err = {err: 'Disallowed file type'};
        }
        var Path = '../../.tmp/public/uploads/avatar/' + user.id + '.' + extension;
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
