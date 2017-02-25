/**
 * IconController
 *
 * @description :: Server-side logic for managing icons
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */


module.exports = {

  create: function (req, res, next){
    Interface.findOne(req.param('id'), function foundInterface(err, iface) {
      if (err) return next(err);

        return res.render('icon/new.ejs', {
          interface: iface,
          layout: false
        });
      });
  },



  //Subida de iconos via ajax para la creacion de botones
  new: function(req,res,next){

    if (req.method === 'GET')
      return res.json({ 'status': 'GET not allowed' });
    //	Call to /newicon via GET is error

    var def = req.session.User.admin ? req.param('default_icon') == 'on' : false

    if (req.xhr) {
      var uploadFile = req.file('iconfile');
      var iconObj = {
        user_owner: req.session.User.id,
        name: req.param('name'),
        default_icon: def
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
              iconUrl: require('util').format('/uploads/icons/%s', (icon.id + '.' + extension))
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

