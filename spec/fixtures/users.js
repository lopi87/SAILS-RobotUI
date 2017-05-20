// spec/fixtures/users.js
module.exports = [
  {
    id: 1,
    name: 'User 1',
    email: 'test@test.com',
    encryptedPassword: require('bcrypt').hash('12345678', 10),
    admin: true
},
  {
    id: 2,
    name: 'User 2',
    email: 'test2@test.com',
    encryptedPassword: require('bcrypt').hash('12345678', 10),
    admin: false
  }
];
