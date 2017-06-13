/**
 * IconController
 *
 * @description :: Server-side logic for managing icons
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */


module.exports = {

  create: function (req, res, next){
    Interface.findOne(req.param('id'), function foundInterface(err, iface) {
      if(err) return res.badRequest(err);
      if(!iface) return res.badRequest(__('not_found'));

        return res.render('icon/new.ejs', {
          interface: iface,
          layout: false
        });
      });
  },



  new: function(req,res,next){

    if (req.xhr) {
      if ( req.param('name') == '' ) return res.badRequest( 'You have to give a name.' );

      var uploadFile = req.file('iconfile');
      var iconObj = {
        user_owner: req.session.User.id,
        name: req.param('name'),
        default_icon: req.session.User.admin ? req.param('default_icon') == 'on' : false
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
              if(err) return res.badRequest(err);
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
      return res.badRequest('Ajax call');
    }
  }

};

