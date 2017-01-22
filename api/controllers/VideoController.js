/**
 * VideoController
 *
 * @description :: Server-side logic for managing videos
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var Log = require('log');
log = new Log('debug');


module.exports = {

  'new': function (req, res) {
    res.view();
  },

  create: function (req, res, next){
    Interface.findOne(req.param('id'), function foundInterface(err, iface) {
      if (err) return next(err);
      return res.render('video/new.ejs', {
        interface: iface,
        layout: false
      });
    });
  },

  update_position: function (req, res, next) {
    //Ajax call
    if (req.xhr) {

      var id = req.param('id');
      var x = req.param('x');
      var y = req.param('y');

      Video.update(id, {coordinate_x: x, coordinate_y: y}, function videoUpdated(err) {
        if (err) return res.badRequest(err);
        res.ok({
          msg: 'position updated'
        });
      });

    } else {
      err = 'No Ajax call';
      return res.badRequest(err);
    }
  },

  newvideo: function (req, res, next) {
    if (req.xhr) {
      Interface.findOne(req.param('id'), function foundInterface(err, iface) {
        if (err) return next(err);

        var videoObj = {
          interface_owner: iface.id,
          name: req.param('name'),
          event_name: req.param('event_name')
        };

        //Delete old videos before create new
        Video.destroy({interface_owner: iface.is}).exec(function (err, video) {
          if (err) return next(err);

          Video.create(videoObj, function videoCreated(err, video) {
            if (err) return res.badRequest(err);
            console.log('The video element has been created');

            Interface.update({id: req.param('id')}, {video: video.id}, function ifaceUpdated(err) {
              if (err) return next(err);

              return res.ok();
            });
          });
        });
      });

    } else {
      err = 'Ajax call';
      return res.badRequest(err);
    }

  },


  deletevideo: function (req, res, next) {
    if (req.xhr) {
      Video.destroy({id: req.param('id')}).exec(function deleteVideo(err) {
        console.log('The video element has been deleted');

        //Si hay error
        if (err) {
          console.log(err);
          return res.next(err);
        }

        return res.ok({id: req.param('id')});
      });
    } else {
      err = 'Ajax call';
      return res.badRequest(err);
    }

  },

  edit: function (req, res, next) {
    Video.findOne(req.param('id'), function foundVideo(err, video) {
      if (err) return next(err);
      if (!video) return next();
      res.view({
        video: video
      });
    });
  }

};
