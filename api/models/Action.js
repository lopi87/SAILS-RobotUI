/**
* Actions.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    //La acción pertenece a una interfaz
    interface_owner:{
      model: 'interface'
    },

    //La acción tiene un icono
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
      type: 'hexadecimal'
    },

    color_background: {
      type: 'hexadecimal'
    },

    color_border: {
      type: 'hexadecimal'
    },

    color_active_background: {
      type: 'hexadecimal'
    },

    coordinate_x: {
      type: 'float',
      defaultsTo: 0
    },

    coordinate_y: {
      type: 'float',
      defaultsTo: 0
    },

    color_default: {
      type: 'boolean',
      defaultsTo: true
    },

    element: {
      type: 'string',
      enum: ['button', 'push', 'joystick'],
      defaultsTo: 'button'
    }

  },
  types:{
    ispositive:function(value){
      console.log(value);
      if(value >=0 ){
        return true;
      }
      return false;
    }
  }
};

