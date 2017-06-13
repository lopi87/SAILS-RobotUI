/**
* Actions.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    interface_owner:{
      model: 'interface'
    },

    icon:{
      model: 'icon'
    },

    name: {
      type: 'string'
    },

    code: {
      type: 'string',
      required: true
    },

    color_text: {
      type: 'string',
      defaultsTo: '#FFFFFF',
      color: true
    },

    color_background: {
      type: 'string',
      defaultsTo: '#611BBD',
      color: true
    },

    color_border: {
      type: 'string',
      defaultsTo: '#130269',
      color: true
    },

    color_active_background: {
      type: 'string',
      defaultsTo: '#49247A',
      color: true
    },

    coordinate_x: {
      type: 'float',
      defaultsTo: 0
    },

    coordinate_y: {
      type: 'float',
      defaultsTo: 0
    },

    custom_color: {
      type: 'boolean',
      defaultsTo: false
    }

  },
  types:{
    color:function(color){
      return (/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color));
    }
  }
};

