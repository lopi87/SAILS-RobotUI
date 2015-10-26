/**
 * LanguageController
 *
 * @description :: Server-side logic for managing languages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  change: function (req, res, next) {

    if (req.xhr) {
      if(req.param('locale') != sails.config.i18n.defaultLocale){
        req.setLocale(req.param('locale'));
        req.session.languagePreference = req.param('locale');
      }
    }

    return res.ok({ });

  }
};

