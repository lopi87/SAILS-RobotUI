// spec/api/functional/IndexSpec.js

describe('Sessions', function(){

  function clear() {
    wolfpack.clearResults();
    wolfpack.clearErrors();
  }
  beforeEach(clear);

  it('should fail accessing to a robot/index_public_robots/ page before login', function () {
    request(server)
      .get('/robot/index_public_robots/')
      .expect(403)
  });

  describe('SessionController', function() {
    it('should redirect to robot/index_public_robots/ after login', function () {
      request.agent(server)
        .post("/session/create")
        .send( { email: 'test@test.com', password: '12345678' } )
        .expect(302)
        .expect('Location', '/robot/index_public_robots/')
        .end( function(err,res){
          if(err) throw err;
          console.log(res.text);
          done();
        })
    });


    describe('Authenticated', function () {
      before(function (done) {
        request.agent(server)
          .post('/session/create')
          .send({
            email: 'test@test.com',
            password: '12345678'
          })
          .end(function (err) {
            done(err);
          });
      });


      it ('Index public robots', function () {
        request.agent(server)
          .get('/robot/index_public_robots')
          .send()
          .expect(200)
          .end(function (err) {
            done(err);
          });
      });
    });

  });



});


