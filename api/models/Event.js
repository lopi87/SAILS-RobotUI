/**
* Event.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/


module.exports = {

  attributes: {

    //El evento pertenece a una interfaz
    interface_owner:{
      model: 'interface'
    },

    event_name: {
      type: 'string',
      required: true
    },

    name: {
      type: 'string'
    },

    unit: {
      type: 'string'
    },

    coordinate_x: {
      type: 'float',
      defaultsTo: 0
    },

    coordinate_y: {
      type: 'float',
      defaultsTo: 0
    },

    color:{
      type: 'string',
      defaultsTo: '#130269',
      color: true
    },

    element: {
      type: 'string',
      enum: ['text_field', 'num_field'],
      defaultsTo: 'num_field'
    }

  },
  types:{
    color:function(color){
      return (/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color));
    }
  }
};

