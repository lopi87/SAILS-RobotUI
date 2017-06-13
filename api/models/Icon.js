/**
* Icon.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    user_owner: {
      model: 'user'
    },

    iconUrl:{
      type:'string'
    },

    name:{
      type:'string',
      required: true
    },

    default_icon: {
      type: 'boolean',
      defaultsTo: false
    }

  }
};


