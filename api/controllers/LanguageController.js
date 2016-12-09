/**
 * LanguageController
 *
 * @description :: Server-side logic for managing languages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  change: function (req, res, next) {

    return res.ok({locale: req.getLocale() });

  }
};

