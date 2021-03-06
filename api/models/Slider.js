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

    name: {
      type: 'string'
    },

    code: {
      type: 'string',
      required: true
    },

    value: {
      type: 'integer',
      defaultsTo: 0
    },

    min: {
      type: 'integer',
      defaultsTo: 0
    },

    max: {
      type: 'integer',
      defaultsTo: 100
    },

    step: {
      type: 'integer',
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

    vertical: {
      type: 'boolean',
      defaultsTo: false
    },

    color_default: {
      type: 'boolean',
      defaultsTo: true
    }

  }
};

