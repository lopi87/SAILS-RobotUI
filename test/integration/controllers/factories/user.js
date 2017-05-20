var FactoryGirl = require('factory_girl');


FactoryGirl.define('user', function() {
  this._id = '591f3a05ac59629c25d73c3c';
  this.name = 'Bob';
  this.email = 'test@test.com';
  this.encryptedPassword = "$2a$10$AKIaQSIcjQhdBBNKHt0K6uRMGeoL2D1fP.8dnbwE4Q.YCkHNKsVk.";
  this.language = 'ES';
});
