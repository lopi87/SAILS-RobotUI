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

    busy: {
      type: 'boolean',
      defaultsTo: false
    },

    online: {
      type: 'boolean',
      defaultsTo: false
    },

    ipaddress: {
      type: 'ip',
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

    // Usuario al que pertenece
    owner: {
      model: 'user'
    },

    // Usuarios del robot
    owners: {
      collection: 'user',
      via: 'robots'
    },

    //Interface del robot
    robot_interface: {
      model: 'interface'
    },


    toJSON: function(){
      var obj = this.toObject();
      delete obj._csrf;
      return obj;
    }

  }

};

