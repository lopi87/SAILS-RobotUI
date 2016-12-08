/**
* Interface.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    csscode: {
      type: 'string'
    },

    robot_owner: {
      model: 'robot'
    },

    // Acciones de la interfaz
    actions: {
      collection: 'action',
      via: 'interface_owner'
    },

    // Eventos de la interfaz
    events: {
      collection: 'event',
      via: 'interface_owner'
    },

    //Video de la interfaz
    video: {
      model: 'video'
    },

    panel_sizex: {
      type: 'float',
      defaultsTo: 0,
      ispositive:true
    },

    panel_sizey: {
      type: 'float',
      defaultsTo: 0,
      ispositive:true
    },


    toJSON: function(){
      var obj = this.toObject();
      delete obj._csrf;
      return obj;
    },

    types: {
      ispositive: function (value) {
        if (value >= 0) {
          console.log('value is a positive number');
          return true;
        }
        return false;
      }
    }
  }
};

