// FlashService.js
module.exports = {
  success: function(req, message) {
    var msg = {err: message};
    req.session.flash['success'].push(msg);
  },
  warning: function(req, message) {
    var msg = {err: message};
    req.session.flash['warning'].push(msg);
  },
  error: function(req, message) {
    var msg = {err: message};
    req.session.flash['error'].push(msg);
  },
  info: function(req, message) {
    var msg = {err: message};
    req.session.flash['info'].push(msg);
  },
  server_exit: function(req,message) {
    req.session.flash['server_exit'].push(message);
  },

  ajax_flash: function(req, res, next) {
    if(!req.session.flash) {
      req.session.flash = {success: [], error: [], warning: [], info: [], server_exit: []};
      res.locals.flash = _.clone(req.session.flash);
    }
    else {
      res.locals.flash = _.clone(req.session.flash);
      req.session.flash = {success: [], error: [], warning: [], info: [], server_exit: []};
    }

    return next();
  }

};
