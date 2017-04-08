// var IndexController = require('../../../api/controllers/IndexController'),
//   sinon = require('sinon'),
//   assert = require('assert'),
//   request = require('supertest');

var url = 'http://localhost:1337/', request = require('supertest')(url), should = require('should');
var jsdom = require("jsdom");
var $ = require("jquery")(jsdom.jsdom().parentWindow);

describe('SessionController', function() {
  it('should redirect to robot/index_public_robots/', function (done) {
    var req = request.post("/sessions/create");
    req.send( { email: 'er_lope@hotmail.com', password: '12345678' } );
    req.expect(200);
    req.expect('Location', 'robot/index_public_robots/');
    req.end( function(err,res){
      if(err) throw err;
      console.log(res.text);
      done();
    })
  });
});


describe('Session', function () {

  it('should login', function (done) {
    request
      .get('/')
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        should.not.exist(err);
        var $html = $(res.text);
        var csrf = $html.find('input[name=_csrf]').val();
        console.log(csrf);
        should.exist(csrf);

        request
          .post('/sessions/create')
          .send( {_csrf: csrf, email: 'er_lope@hotmail.com', password: '12345678'} )
          .expect(302)
          .expect('Location', '/')
          .end(done)
      });
  });

});
