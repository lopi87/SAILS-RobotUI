/**
 * Actions.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {

    //El slider pertenece a una interfaz
    interface_owner:{
      model: 'interface'
    },

    name: {
      type: 'string'
    },

    code: {
      type: 'string',
      required: true
    },

    value: {
      type: 'integer',
      required: true,
      defaultsTo: 0
    },

    min: {
      type: 'integer',
      required: true,
      defaultsTo: 0
    },

    max: {
      type: 'integer',
      required: true,
      defaultsTo: 100
    },

    step: {
      type: 'integer',
      required: true,
      defaultsTo: 10
    },

    color: {
      type: 'hexadecimal',
      defaultsTo: 'FFFFFF'
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
    }

  }
};

