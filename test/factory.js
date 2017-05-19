const factory = require('factory-girl').factory;
const User    = require('../models/user');

factory.define('user', User, {
  name: 'Bob',
  email: 'test@test.com',
  encryptedPassword: require('bcrypt').hash('12345678', 10),
  password: '12345678',
  confirmation: '12345678',
  language: 'ES',
  admin: false
});
