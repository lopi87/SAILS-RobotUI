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
      type: 'number',
      required: true
    },

    port: {
      type: 'number',
      required: true
    },

    public: {
      type: 'boolean',
      defaultsTo: false
    },


    // Propietarios del robot
    owners: {
      collection: 'user',
      via: 'robots'
    },



    toJSON: function(){
      var obj = this.toObject();
      delete obj._csrf;
      return obj;
    }

  }

};

