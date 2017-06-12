/**
 * sliderController
 *
 * @description :: Server-side logic for managing sliders
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {


  update_position: function (req, res, next) {
    //Ajax call
    if (req.xhr) {

      var id = req.param('id');
      var x = req.param('x');
      var y = req.param('y');

      Slider.update(id, {coordinate_x: x, coordinate_y: y}, function sliderUpdated(err){
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

  create: function (req, res, next){
    Interface.findOne(req.param('id'), function foundInterface(err, iface) {
      if (err) return next(err);
        return res.render('slider/new.ejs', {
          interface: iface,
          layout: false
        });
      });
  },

  new: function (req, res, next) {
    if (req.xhr) {
      Interface.findOne(req.param('id'), function foundInterface(err, iface) {
        if (err) return next(err);

        var vertical = req.param('vertical') == 'true' ? true : false

        var sliderObj = {
          interface_owner: iface.id,
          name: req.param('name'),
          code: req.param('code'),
          min: req.param('min'),
          max: req.param('max'),
          value: req.param('value'),
          step: req.param('step'),
          length: req.param('length'),
          vertical: vertical
        };

        Slider.create(sliderObj, function sliderCreated(err, slider) {
          if (err) return res.badRequest(err.Errors);
          console.log('The slider has been created');
          return res.render('interface/_slider.ejs', {
            slider: slider,
            layout: false
          });
        });
      });

    } else {
      err = 'Ajax call';
      return res.badRequest(err);
    }

  },


  destroy: function (req, res, next) {
    if (req.xhr) {
      Slider.destroy({id: req.param('id')}).exec(function deleteslider(err) {
        if(err) return res.badRequest(err);
        return res.ok({id: req.param('id')});
      });
    } else {
      return res.badRequest('Ajax call');
    }
  },


  edit: function(req, res, next){
    Slider.findOne(req.param('id'), function foundslider(err, slider){
      if(err) return res.badRequest(err);
      if(!slider) return res.badRequest(__('not_found'));

      return res.render('slider/edit.ejs', {
        slider: slider,
        layout: false
      });
    });
  },


  update: function(req, res, next){
    if (req.xhr) {
        var vertical = req.param('vertical') == 'true' ? true : false

        var sliderObj = {
          name: req.param('name'),
          code: req.param('code'),
          min: req.param('min'),
          max: req.param('max'),
          value: req.param('value'),
          step: req.param('step'),
          length: req.param('length'),
          vertical: vertical
        };


        Slider.update(req.param('id'), sliderObj, function eventUpdated(err, slider) {
          if (err) return res.badRequest(err);

          FlashService.success(req, 'Slider has been updated');

          Slider.findOne(req.param('id')).exec(function (err, slider) {
            return res.render('interface/_slider.ejs', {
              slider: slider,
              layout: false
            });
          });

        });
    } else {
      return res.badRequest('Ajax call');
    }
  },

  index: function(req, res, next) {
    slider.find({interface_owner: req.session.User.id}).exec(function (err, sliders) {
      if (err) return next(err);
      res.view({
        sliders: sliders
      });
    });
  }



};
