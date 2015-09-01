/**
* Robot.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    name:{
      type: 'string',
      required: true
    },

    description:{
      type: 'string'
    },

    online: {
      type: 'boolean',
      defaultsTo: false
    },

    ipaddress: {
      type: 'integer',
      required: true
    },

    port: {
      type: 'integer',
      required: true
    },

    public: {
      type: 'boolean',
      defaultsTo: false
    },


    // Usuarios del robot
    owners: {
      collection: 'user',
      via: 'robots'
    },

    //Interface del robot
    interface: {
      model: 'interface'
    },


    toJSON: function(){
      var obj = this.toObject();
      delete obj._csrf;
      return obj;
    }

  }

};

