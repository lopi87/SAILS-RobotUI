// const factory = require('factory-girl').factory;
//
// var request = require('supertest'),
//   should = require('should');
//
// var robot = factory.create('robot');
// var user = factory.create('user', { id: robot.owner });
//
//
// describe('The Robot controller', function() {
//
//   console.log(robot.name);
//
//
//   describe('#index()', function() {
//     it('should Forbidden', function (done) {
//       request(sails.hooks.http.app)
//         .get('/robot/index')
//         .send()
//         .expect(403)
//         .end(done)
//     });
//   });
//
//
//   describe('Authenticated', function () {
//     before(function (done) {
//       request(sails.hooks.http.app)
//         .post('/session/create/')
//         .send({
//           email: user.email,
//           password: user.password
//         })
//         .expect(302)
//         .end(function (err) {
//           done(err);
//         });
//     });
//
//
//     describe('#new', function() {
//       it('should get data', function (done) {
//         request(sails.hooks.http.app)
//           .get('/robot/new/')
//           .send()
//           .expect(200)
//           .end(function (err, res) {
//             if (err) return done(err);
//             should.exist(res.body);
//             done();
//           });
//       });
//     });
//
//     describe('#create()', function() {
//       it('should create a robot', function (done) {
//         request(sails.hooks.http.app)
//           .post('/robot/create/')
//           .send( robot )
//           .expect(302)
//           .end(function(err, res){
//             if(err){
//               return done(err);
//             }
//             done();
//           })
//       });
//     });
//
//
//     it ('Index public robots', function () {
//       request(sails.hooks.http.app)
//         .get('/robot/index_public_robots')
//         .send()
//         .expect(200)
//         .end(function (err, res) {
//           if (err) return done(err);
//           should.exist(res.body);
//           done();
//         });
//     });
//
//
//     it('#update /robot/update/:user_id', function(done){
//       robot_edit = factory.create('robot');
//       request(sails.hooks.http.app)
//         .put('/robot/update/' + robot_edit.id)
//         .send(robot_edit)
//         .expect(200)
//         .end(function (err, res) {
//           if (err) return done(err);
//           should.exist(res.body);
//           done();
//         });
//     });
//
//     describe('#show()', function() {
//       it('should show a robot', function (done) {
//         console.log(robot.id);
//
//         request(sails.hooks.http.app)
//           .get('/robot/show/' + robot.id )
//           .send({ id: robot.id })
//           .expect(200)
//           .end(function (err, res) {
//             if (err) return done(err);
//             should.exist(res.body);
//             done();
//           });
//       });
//     });
//
//
//   });
// });
