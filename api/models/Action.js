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

    name: {
      type: 'string',
      required: true
    },

    code: {
      type: 'string',
      required: true
    },

    element: {
      type: 'string',
      enum: ['button', 'push', 'video'],
      defaultsTo: 'button'
    }

  }
};

