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

    down: {
      type: 'boolean',
      defaultsTo: true
    },

    ipaddress: {
      type: 'ip',
      required: true
    },

    port: {
      type: 'integer',
      required: true
    },

    avatarUrl:{
      type:'string',
      defaultsTo: '/images/robot_avatar/robot_avatar.png'
    },

    avatarFd:{
      type:'string'
    },


    // Usuario al que pertenece
    owner: {
      model: 'user'
    },

    public_drive: {
      type: 'boolean',
      defaultsTo: false
    },

    public_view: {
      type: 'boolean',
      defaultsTo: false
    },


    // Add a reference to Robot
    drivers:{
      collection: 'user',
      via: 'd_robots'
    },

    // Add a reference to Robot
    viewers:{
      collection: 'user',
      via: 'v_robots'
    },


    //Interface del robot
    robot_interface: {
      model: 'interface'
    },


    longitude: {
      type: 'float'
    },

    latitude: {
      type: 'float'
    },


    toJSON: function(){
      var obj = this.toObject();
      delete obj._csrf;
      return obj;
    }

  }

};

