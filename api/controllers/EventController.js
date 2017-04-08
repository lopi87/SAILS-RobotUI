/**
 * EventController
 *
 * @description :: Server-side logic for managing events
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */



module.exports = {

  create: function (req, res, next){
    Interface.findOne(req.param('id'), function foundInterface(err, iface) {
      if(err) return res.badRequest(err);
      if(!iface) return res.badRequest(__('not_found'));

        return res.render('event/new.ejs', {
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

      Event.update(id, {coordinate_x: x, coordinate_y: y}, function eventUpdated(err){
        if(err) return res.badRequest(err);
        res.ok({
          msg: 'position updated'
        });
      });

    }else{
      return res.badRequest('Ajax call');
    }
  },


  newevent: function (req, res, next) {
    if (req.xhr) {
      Interface.findOne(req.param('id'), function foundInterface(err, iface) {
        if (err) return next(err);

        var eventObj = {
          interface_owner: iface.id,
          color: req.param('color'),
          name: req.param('name'),
          event_name: req.param('event_name')
        };

        Event.create(eventObj, function eventCreated(err, event) {
          if (err) return res.badRequest(err.Errors);

          return res.render('interface/_event.ejs', {
            event: event,
            layout: false
          });

        });
      });

    } else {
      return res.badRequest('Ajax call');
    }

  },

  update: function(req, res, next){
    if (req.xhr) {

      var eventObj = {
        name: req.param('name'),
        event_name: req.param('event_name'),
        color: req.param('color')
      };

      Event.update(req.param('id'), eventObj, function eventUpdated(err, event) {
        if(err) return res.badRequest(err);

        FlashService.success(req, 'Event has been updated');

        Event.findOne(req.param('id')).exec(function(err, event) {
          return res.render('interface/_event.ejs', {
            event: event,
            layout: false
          });
        });

      });
    } else {
      return res.badRequest('Ajax call');
    }
  },


  destroy: function (req, res, next) {
    if (req.xhr) {
      Event.destroy({id: req.param('id')}).exec(function deleteevent(err) {
        if(err) return res.badRequest(err);

        return res.ok({id: req.param('id')});
      });
    } else {
      return res.badRequest('Ajax call');
    }
  },


  edit: function(req, res, next){
    Event.findOne(req.param('id'), function foundEvent(err, event){
      if(err) return res.badRequest(err);
      if(!event) return res.badRequest(__('not_found'));

      return res.render('event/edit.ejs', {
        event: event,
        layout: false
      });
    });
  }

};
