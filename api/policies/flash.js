/*
module.exports = function(req, res, next){

  res.locals.flash = {};

  if(!req.session.flash) return next();

  res.locals.flash = _.clone(req.session.flash);

  // clear flash
  req.session.flash={};
  next();

};

*/

// flash.js policy MEJORADO
module.exports = function(req, res, next) {
  res.locals.flash = { success: [], error: [], warning: [], info: [], server_exit: [] };

  if(!req.session.flash) {
    req.session.flash = { success: [], error: [], warning: [], info: [], server_exit: [] };
    return next();
  }
  res.locals.flash = _.clone(req.session.flash);

  // Clear flash
  req.session.flash = { success: [], error: [], warning: [], info: [], server_exit: [] };
  return next();
};
