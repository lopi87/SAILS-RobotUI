/**
* Interface.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    robot_owner: {
      model: 'robot'
    },

    // Acciones de la interfaz
    actions: {
      collection: 'action',
      via: 'interface_owner'
    }

  }
};

