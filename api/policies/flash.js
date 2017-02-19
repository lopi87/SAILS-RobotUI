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

// flash.js policy
module.exports = function(req, res, next) {

  if(!req.session.flash) {
    req.session.flash = { success: [], error: [], warning: [], info: [], server_exit: [] };
    res.locals.flash = _.clone(req.session.flash);
  }
  else{
    res.locals.flash = _.clone(req.session.flash);
    req.session.flash = { success: [], error: [], warning: [], info: [], server_exit: [] };
  }

  return next();

};
