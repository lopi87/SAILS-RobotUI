/**
 * MessageController
 *
 * @description :: Server-side logic for managing Messages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  index: function(req, res, next) {

    //TODO trabajar las relaciones, consultar mis mensajes. (dado user_id) ademas de devolver una lista de todos los usuarios existentes
  },


  send: function(req, res, next) {

    //TODO mandar un mensaje a un usuario con la correspondiente notificación realtime

  },

  read: function(req, res, next) {

    //TODO leer un mensaje, marcar como leido

  },


  message_subscribe: function(req, res, next){

    //Subscribir a mensajes
  }

};
