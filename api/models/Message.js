/**
 * Message.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
    content:{
      type: 'string',
      required: true
    },

    title: {
      type: 'string',
      required: true
    },

    read: {
      type: 'boolean',
      defaultsTo: false
    },

    from_user_id:{
      model: 'user'
    },

    to_user_id:{
      model: 'user'
    },

    toJSON: function(){
      var obj = this.toObject();
      delete obj._csrf;
      return obj;
    }
  }

};
