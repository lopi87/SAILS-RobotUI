// api/policies/localize.js

module.exports = function(req, res, next) {

  if (req.session.languagePreference == undefined){
    req.session.languagePreference = sails.config.i18n.defaultLocale;
  }

  if(req.param('locale') != req.session.languagePreference && req.param('locale') != undefined ){
    req.session.languagePreference = req.param('locale');
    msg = req.__('language') + ': ' + req.param('locale').toUpperCase();
    FlashService.info(req, msg );
  }

  req.setLocale(req.session.languagePreference);

  next();
};

