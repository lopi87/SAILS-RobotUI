/**
* Guest.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/


module.exports = {

  attributes: {

    //El invitado lo es de un robot
    robot:{
      model: 'robot'
    },

    //La acción tiene un icono
    user:{
      model: 'user'
    },

    permission: {
      type: 'string',
      enum: ['full', 'see', 'control'],
      defaultsTo: 'see'
    }
  }
};

