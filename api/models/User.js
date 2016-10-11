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
      defaultsTo: 'ES'
    },

    encryptedPassword:{
      type: 'string'
    },

    // Add a reference to Robot
    d_robots:{
      collection: 'robot',
      via: 'drivers',
      dominant: true
    },

    // Add a reference to Robot
    v_robots:{
      collection: 'robot',
      via: 'viewers',
      dominant: true
    },

    sessions:{
      model: 'session'
    },


    avatarUrl:{
      type:'string',
      defaultsTo: '/images/avatar/avatar.png'
    },

    avatarFd:{
      type:'string'
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
      delete values.password;
      delete values.confirmation;
      next();
    });

  },

  beforeUpdate: function (values, next) {

    if(values.newPassword){
      if(!values.password || values.password != values.confirmation){
        return next({err: ["Password doesn't match password confirmation."]})
      }

      require('bcrypt').hash(values.password, 10, function passwordEncrypted(err, encryptedPassword){
        if(err) return next(err);
        values.encryptedPassword = encryptedPassword;
        values.onLine = true;
        delete values.password;
        delete values.confirmation;
        next();
      });
    }else{
      next();
    }
  }

};

