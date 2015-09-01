/**
* Actions.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    // Add a reference to Robot
    interfaces:{
      collection: 'interface',
      via: 'actions'
    },

    name: {
      type: 'string',
      required: true
    },

    code: {
      type: 'string',
      required: true
    }


  }
};

