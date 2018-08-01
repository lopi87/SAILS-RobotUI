/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  schema: true,
  autoUpdatedAt: true,
  autoCreatedAt: true,

  attributes: {
    name:{
      type: 'string',
      required: true
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

    longitude: {
      type: 'float'
    },

    latitude: {
      type: 'float'
    },

    language: {
      type:'string',
      defaultsTo: 'ES'
    },

    encryptedPassword:{
      type: 'string'
    },

    d_robots:{
      collection: 'robot',
      via: 'drivers',
      dominant: true
    },

    v_robots:{
      collection: 'robot',
      via: 'viewers',
      dominant: true
    },

    robots:{
      collection: 'robot',
      via: 'owner',
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


  beforeCreate: function(user, next){
    if(!user.password || user.password != user.confirmation){
      return next({err: ["Password doesn't match password confirmation."]})
    }

    require('bcrypt-nodejs').hash(user.password, 10, null, function passwordEncrypted(err, encryptedPassword){
      if(err) return next(err);
      user.encryptedPassword = encryptedPassword;
      user.online = true;
      delete user.password;
      delete user.confirmation;
      next(null, user);
    });

  },

  beforeUpdate: function (values, next) {

    if(values.newPassword){
      if(!values.password || values.password   != values.confirmation){
        return next({err: ["Password doesn't match password confirmation."]})
      }

      require('bcrypt-node.js').hash(values.password, 10, null, function passwordEncrypted(err, encryptedPassword){
        if(err) return next(err);
        values.encryptedPassword = encryptedPassword;
        values.online = true;
        delete values.password;
        delete values.confirmation;
        next();
      });
    }else{
      next();
    }
  }

};

