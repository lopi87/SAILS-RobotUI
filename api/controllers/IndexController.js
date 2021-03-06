/**
 * IndexController
 *
 * @description :: Server-side logic for managing Indices
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */


module.exports = {

  index: function (req, res) {
      return res.view();
  },

  about: function (req, res){

    return res.view();
  },

  contact: function (req, res){

    return res.view();
  },

  documentation: function (req, res) {

    return res.download('documentation/robotui.pdf');
  }


};
