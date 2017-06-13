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

    actions: {
      collection: 'action',
      via: 'interface_owner'
    },


    sliders: {
      collection: 'slider',
      via: 'interface_owner'
    },

    events: {
      collection: 'event',
      via: 'interface_owner'
    },

    video: {
      model: 'video'
    },

    panel_sizex: {
      type: 'float',
      defaultsTo: 910,
      ispositive:true
    },

    panel_sizey: {
      type: 'float',
      defaultsTo: 500,
      ispositive:true
    },

    toJSON: function(){
      var obj = this.toObject();
      delete obj._csrf;
      return obj;
    }
  },
  types: {
    ispositive: function (value) {
      return value >= 0
    }
  }
};

