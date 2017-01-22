/**
 * EventController
 *
 * @description :: Server-side logic for managing events
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */



module.exports = {

  'new': function(req, res){
    res.view();
  },


  create: function (req, res, next){
    Interface.findOne(req.param('id'), function foundInterface(err, iface) {
      if (err) return next(err);
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
      err= 'No Ajax call';
      return res.badRequest(err);
    }
  },

  newevent: function (req, res, next) {
    if (req.xhr) {
      Interface.findOne(req.param('id'), function foundInterface(err, iface) {
        if (err) return next(err);

        var eventObj = {
          interface_owner: iface.id,
          name: req.param('name'),
          event_name: req.param('event_name'),
          element: 'num_field'
        };


        Event.create(eventObj, function eventCreated(err, event) {
          if (err) return res.badRequest(err);

          event.save(function (err) {
            if (err) return res.badRequest(err);

            console.log('The event has been created');

            return res.render('interface/_event.ejs', {
              event: event,
              layout: false
            });

          });
        });
      });

    } else {
      err = 'Ajax call';
      return res.badRequest(err);
    }

  },


  deleteevent: function (req, res, next) {
    if (req.xhr) {
      Event.destroy({id: req.param('id')}).exec(function deleteevent(err) {
        console.log('The event has been deleted');

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

  edit: function(req, res, next){
    Event.findOne(req.param('id'), function foundEvent(err, event){
      if(err) return next(err);
      if(!event) return next();
      res.view({
        event: event
      });
    });
  }

};
