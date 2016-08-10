/**
 * Session.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
    socket_id:{
      type: 'string',
      required: true
    },

    user_id:{
      model: 'user',
      required: true,
      defaultsTo: 'invited'
    },

    toJSON: function(){
      var obj = this.toObject();
      delete obj._csrf;
      return obj;
    }

  }

};

