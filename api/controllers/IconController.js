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

    if (req.method === 'GET')
      return res.json({ 'status': 'GET not allowed' });
    //	Call to /newicon via GET is error

    if (req.xhr) {
      // Yup, it's AJAX alright.

      var uploadFile = req.file('iconfile');
      var iconObj = {
        user_owner: req.session.User.id
      };



      Icon.create(iconObj, function iconCreated(err, icon) {
        if (err) return res.badRequest(err);

       uploadFile.upload({
        saveAs: function(file, cb) {

          // setting allowed file types
          var allowedTypes = ['image/jpeg', 'image/png'];
          var extension = file.filename.split('.').pop();

          // seperate allowed and disallowed file types
          if(allowedTypes.indexOf(file.headers['content-type']) === -1) {
            err = { err: 'Disallowed file type' };
            return res.badRequest(err);
          }

          Icon.update(icon.id, {
            iconUrl: require('util').format('%s/uploads/icons/%s', icon.id + '.' + extension)
          }).exec(function iconUpdated(err, updated){
            if (err) {
              err = {err: 'Err'};
              FlashService.error(req, err);
              return;
            }
          });

          var Path = '../../.tmp/public/uploads/icons/' + icon.id + '.' + extension;
          cb(null, Path);
        }
      },function onUploadComplete(err, files) {
        if (err) return res.badRequest(err);
        Icon.findOne(icon.id, function foundIcon(err, icon){
          if(err) return res.badRequest(err);
          return res.ok({id: icon.id, url: icon.iconUrl});
        });
      });
      });
    }else{
      return res.next(err);
    }
  }

};
