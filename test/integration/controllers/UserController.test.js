// var request = require('supertest'), should = require('should');
// var jsdom = require("jsdom");
// var $ = require("jquery")(jsdom.jsdom().parentWindow);
// var agent = request.agent;
//
// describe('User Controller', function() {
//
//
//   var user;
//
//   before(function (done) {
//     done(null, sails);
//     user = agent(sails.hooks.http.app);
//   });
//
//   describe('#index()', function() {
//     it('should Forbidden', function (done) {
//       request(sails.hooks.http.app)
//         .get('/user/index')
//         .send()
//         .expect(403)
//         .end(done)
//     });
//   });
//
//   describe('#sign_up()', function() {
//     it('should get data', function (done) {
//       request(sails.hooks.http.app)
//         .get('/user/new')
//         .send()
//         .expect(200)
//         .end(function (err, res) {
//           if (err) return done(err);
//           should.exist(res.body);
//           done();
//         });
//     });
//   });
//
//
//   describe('#create()', function() {
//     it('should create an user', function (done) {
//
//       request(sails.hooks.http.app)
//         .get('/user/new')
//         .expect(200)
//         .end(function (err, res) {
//           if (err) return done(err);
//           should.not.exist(err);
//           var $html = $(res.text);
//           var csrf = $html.find('input[name=_csrf]').val();
//           console.log(csrf);
//           should.exist(csrf);
//
//           request(sails.hooks.http.app)
//             .post('/user/create')
//             .send({_csrf: csrf,  name: 'username', language: 'ES', email: 'user1@mail.com', password: '12345678', confirmation: '12345678'})
//             .expect(200)
//             .expect('Location', '/user/show/')
//             .end(done)
//         });
//     });
//   });
//
//
//
//   describe('#show()', function() {
//     it('should show an user', function (done) {
//       request(sails.hooks.http.app)
//         .get('/user/show')
//         .send({ id: user.id })
//         .expect(200)
//         .end(function (err, res) {
//           if (err) return done(err);
//           should.exist(res.body);
//           done();
//         });
//     });
//   });
//
// });
