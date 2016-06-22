/**
 * app.js
 *
 * Use `app.js` to run your app without `sails lift`.
 * To start the server, run: `node app.js`.
 *
 * This is handy in situations where the sails CLI is not relevant or useful.
 *
 * For example:
 *   => `node app.js`
 *   => `forever start app.js`
 *   => `node debug app.js`
 *   => `modulus deploy`
 *   => `heroku scale`
 *
 *
 * The same command-line arguments are supported, e.g.:
 * `node app.js --silent --port=80 --prod`
 */
// Ensure we're in the project directory, so relative paths work as expected
// no matter where we actually lift from.
process.chdir(__dirname);

// Ensure a "sails" can be located:
(function() {
  var sails;
  try {
    sails = require('sails');
  } catch (e) {
    console.error('To run an app using `node app.js`, you usually need to have a version of `sails` installed in the same directory as your app.');
    console.error('To do that, run `npm install sails`');
    console.error('');
    console.error('Alternatively, if you have sails installed globally (i.e. you did `npm install -g sails`), you can use `sails lift`.');
    console.error('When you run `sails lift`, your app will still use a local `./node_modules/sails` dependency if it exists,');
    console.error('but if it doesn\'t, the app will run with the global sails instead!');
    return;
  }

  // Try to get `rc` dependency
  var rc;
  try {
    rc = require('rc');
  } catch (e0) {
    try {
      rc = require('sails/node_modules/rc');
    } catch (e1) {
      console.error('Could not find dependency: `rc`.');
      console.error('Your `.sailsrc` file(s) will be ignored.');
      console.error('To resolve this, run:');
      console.error('npm install rc --save');
      rc = function () { return {}; };
    }
  }



  /*
  //Socket
  var io = require('socket.io').listen(3000);
  var users_loggin = {};

  //evento, nueva conexion al servidor
  io.sockets.on("connection", function(socket){
    console.log('Socket abierto');

    //Añadimos el par socket - usuario de la lista de conectados
    users_loggin[socket.id] = 'invited';

    //Imprimir hash (para depurar)
    for (var i = 0, keys = Object.keys(users_loggin), ii = keys.length; i < ii; i++) {
      console.log('key : ' + keys[i] + ' val : ' + users_loggin[keys[i]]);
    }


    //Funcion desconexion
    socket.on('disconnect', function(){
      //Detecta si un cliente se desconecta
      console.log('Cliente desconectado - id del socket: ' + socket.id);
      //socket.broadcast.to(roomName).emit('user_leave', {user_name: "johnjoe123"});

      //Eliminamos el par socket - usuario de la lista de conectados
      delete users_loggin[socket.id];
      console.log('Usuarios restantes: \n');
      for (var i = 0, keys = Object.keys(users_loggin), ii = keys.length; i < ii; i++) {
        console.log('key : ' + keys[i] + ' val : ' + users_loggin[keys[i]]);
      }

    });
  });
   */

  // Start server
  sails.lift(rc('sails'));

})();





