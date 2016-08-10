/**
 * IconController
 *
 * @description :: Server-side logic for managing icons
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */


var gm = require('gm');

module.exports = {

  //Subida de iconos via ajax para la creacion de botones
  create: function(req,res,next){

/*
    ImageService.process(
      'http://www.google.com/intl/en_ALL/images/srpr/logo11w.png',
      './tmp/public/uploads/googlelogo.png',
      function (data) {
        res.send(data);
      });
*/

    if (req.method === 'GET')
      return res.json({ 'status': 'GET not allowed' });
    //	Call to /newicon via GET is error

    if (req.xhr) {
      // Yup, it's AJAX alright.

      var uploadFile = req.file('iconfile');
      console.log(uploadFile);

      var iconObj = {
        user_owner: req.session.User.id
      };

      Icon.create(iconObj, function iconCreated(err, icon) {

        //Si hay error
        if (err) {
          return res.badRequest(err);
        }

        uploadFile.upload({
          saveAs: function(file, cb) {
            // setting allowed file types
            var allowedTypes = ['image/jpeg', 'image/png'];

            var extension = file.filename.split('.').pop();
            icon.format = file.headers['content-type'];

            // seperate allowed and disallowed file types
            if(allowedTypes.indexOf(file.headers['content-type']) === -1) {
              err = { err: 'Disallowed file type' };
              return res.badRequest(err);

            }else{
              var Path = '../../.tmp/public/uploads/icons/' + icon.id + '.' + extension;
              cb(null, Path);

              //resizing

              ImageService.resize(Path, Path, 100, function(){
                console.log('OK');
              })


            }

          }},function onUploadComplete(err, files) {
          if (err) return res.badRequest(err);


          //Save into db
          icon.save(function (err) {
            if (err) return res.badRequest(err);
          });
          return res.ok({id: icon.id});

        });
      });
    }else{
      return res.next(err);
    }

  }


};

