/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    name:{
      type: 'string',
      required: true
    },

    title:{
      type: 'string'
    },


    email:{
      type: 'string',
      email: true,
      required: true,
      unique: true
    },

    admin: {
      type: 'boolean',
      defaultsTo: false
    },

    online: {
      type: 'boolean',
      defaultsTo: false
    },

    language: {
      type:'string',
      defaultsTo: 'EN'
    },

    encryptedPassword:{
      type: 'string'
    },

    // Add a reference to Robot
    robots:{
      collection: 'robot',
      via: 'owners'
    },


    sessions:{
      model: 'session'
    },


    toJSON: function(){
      var obj = this.toObject();
      delete obj.password;
      delete obj.confirmation;
      delete obj.encryptedPassword;
      delete obj._csrf;
      return obj;
    }

  },


  beforeValidation: function(values, next){

    console.log(values.admin);


    if(typeof values.admin != 'undefined'){
      if(values.admin == 'unchecked') {
        console.log(values);
        values.admin = false;
      } else if (values.admin[1] == 'on') {
        values.admin = true;
      }
    }
    next();
  },


  beforeCreate: function(values, next){
    if(!values.password || values.password != values.confirmation){
      return next({err: ["Password doesn't match password confirmation."]})
    }

    require('bcrypt').hash(values.password, 10, function passwordEncrypted(err, encryptedPassword){
      if(err) return next(err);
      values.encryptedPassword = encryptedPassword;
      values.onLine = true;
      next();
    });

  }






};

