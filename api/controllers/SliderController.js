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

      slider.update(id, {coordinate_x: x, coordinate_y: y}, function sliderUpdated(err){
        if(err) return res.badRequest(err);
        res.ok();
      });

    }else{
      err= 'No Ajax call';
      return res.badRequest(err);
    }
  },

  create: function (req, res, next){
    //Mis iconos y los del sistema por defecto
    Interface.findOne(req.param('id'), function foundInterface(err, iface) {
      if (err) return next(err);
        return res.render('slider/new.ejs', {
          interface: iface,
          layout: false
        });
      });
  },

  newslider: function (req, res, next) {
    if (req.xhr) {
      Interface.findOne(req.param('id'), function foundInterface(err, iface) {
        if (err) return next(err);

        var sliderObj = {
          interface_owner: iface.id,
          name: req.param('name'),
          code: req.param('code'),
          min: req.param('min'),
          max: req.param('max'),
          value: req.param('value'),
          step: req.param('step')
        };


        Slider.create(sliderObj, function sliderCreated(err, slider) {
          if (err) return res.badRequest(err);

          slider.save(function (err) {
            if (err) return res.badRequest(err);

            console.log('The slider has been created');

            return res.render('interface/slider_row.ejs', {
              slider: slider,
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


  deleteslider: function (req, res, next) {
    if (req.xhr) {
      slider.destroy({id: req.param('id')}).exec(function deleteslider(err) {
        console.log('The slider has been deleted');

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
    slider.findOne(req.param('id'), function foundslider(err, slider){
      if(err) return next(err);
      if(!slider) return next();

        res.view({slider: slider});
    });
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
