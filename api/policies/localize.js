// api/policies/localize.js

/*
module.exports = function(req, res, next) {


  var antes = req.getLocale();

  if(req.param('locale') != sails.config.i18n.defaultLocale){
    req.setLocale(req.param('locale'));
    req.session.languagePreference = req.param('locale');
  }


  var despues = req.getLocale();

  //res.setLocale(req.param('locale') || sails.config.i18n.defaultLocale);
  var a = sails.config.i18n.defaultLocale;
  var b = req.param('locale');

//  res.setLocale('en');

  next();
};

*/


// api/policies/localize.js
module.exports = function(req, res, next) {

  if (req.session.languagePreference == undefined){
    req.session.languagePreference = sails.config.i18n.defaultLocale;
  }

  if(req.param('locale') != req.session.languagePreference && req.param('locale') != undefined){
    req.session.languagePreference = req.param('locale');
  }

  req.setLocale(req.session.languagePreference);

  next();
};

