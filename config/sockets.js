/**
 * WebSocket Server Settings
 * (sails.config.sockets)
 *
 * These settings provide transparent access to the options for Sails'
 * encapsulated WebSocket server, as well as some additional Sails-specific
 * configuration layered on top.
 *
 * For more information on sockets configuration, including advanced config options, see:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.sockets.html
 */

module.exports.sockets = {


  /***************************************************************************
   *                                                                          *
   * Node.js (and consequently Sails.js) apps scale horizontally. It's a      *
   * powerful, efficient approach, but it involves a tiny bit of planning. At *
   * scale, you'll want to be able to copy your app onto multiple Sails.js    *
   * servers and throw them behind a load balancer.                           *
   *                                                                          *
   * One of the big challenges of scaling an application is that these sorts  *
   * of clustered deployments cannot share memory, since they are on          *
   * physically different machines. On top of that, there is no guarantee     *
   * that a user will "stick" with the same server between requests (whether  *
   * HTTP or sockets), since the load balancer will route each request to the *
   * Sails server with the most available resources. However that means that  *
   * all room/pubsub/socket processing and shared memory has to be offloaded  *
   * to a shared, remote messaging queue (usually Redis)                      *
   *                                                                          *
   * Luckily, Socket.io (and consequently Sails.js) apps support Redis for    *
   * sockets by default. To enable a remote redis pubsub server, uncomment    *
   * the config below.                                                        *
   *                                                                          *
   * Worth mentioning is that, if `adapter` config is `redis`, but host/port  *
   * is left unset, Sails will try to connect to redis running on localhost   *
   * via port 6379                                                            *
   *                                                                          *
   ***************************************************************************/
  // adapter: 'memory',

  //
  // -OR-
  //

  // adapter: 'redis',
  // host: '127.0.0.1',
  // port: 6379,
  // db: 'sails',
  // pass: '<redis auth password>',


  /***************************************************************************
   *                                                                          *
   * Whether to expose a 'get /__getcookie' route with CORS support that sets *
   * a cookie (this is used by the sails.io.js socket client to get access to *
   * a 3rd party cookie and to enable sessions).                              *
   *                                                                          *
   * Warning: Currently in this scenario, CORS settings apply to interpreted  *
   * requests sent via a socket.io connection that used this cookie to        *
   * connect, even for non-browser clients! (e.g. iOS apps, toasters, node.js *
   * unit tests)                                                              *
   *                                                                          *
   ***************************************************************************/

  // grant3rdPartyCookie: true,


  /***************************************************************************
   *                                                                          *
   * `beforeConnect`                                                          *
   *                                                                          *
   * This custom beforeConnect function will be run each time BEFORE a new    *
   * socket is allowed to connect, when the initial socket.io handshake is    *
   * performed with the server.                                               *
   *                                                                          *
   * By default, when a socket tries to connect, Sails allows it, every time. *
   * (much in the same way any HTTP request is allowed to reach your routes.  *
   * If no valid cookie was sent, a temporary session will be created for the *
   * connecting socket.                                                       *
   *                                                                          *
   * If the cookie sent as part of the connection request doesn't match any   *
   * known user session, a new user session is created for it.                *
   *                                                                          *
   * In most cases, the user would already have a cookie since they loaded    *
   * the socket.io client and the initial HTML page you're building.         *
   *                                                                          *
   * However, in the case of cross-domain requests, it is possible to receive *
   * a connection upgrade request WITHOUT A COOKIE (for certain transports)   *
   * In this case, there is no way to keep track of the requesting user       *
   * between requests, since there is no identifying information to link      *
   * him/her with a session. The sails.io.js client solves this by connecting *
   * to a CORS/jsonp endpoint first to get a 3rd party cookie(fortunately this*
   * works, even in Safari), then opening the connection.                     *
   *                                                                          *
   * You can also pass along a ?cookie query parameter to the upgrade url,    *
   * which Sails will use in the absence of a proper cookie e.g. (when        *
   * connecting from the client):                                             *
   * io.sails.connect('http://localhost:1337?cookie=smokeybear')              *
   *                                                                          *
   * Finally note that the user's cookie is NOT (and will never be) accessible*
   * from client-side javascript. Using HTTP-only cookies is crucial for your *
   * app's security.                                                          *
   *                                                                          *
   ***************************************************************************/
  // beforeConnect: function(handshake, cb) {
  //   // `true` allows the connection
  //   return cb(null, true);
  //
  //   // (`false` would reject the connection)
  // },


  /***************************************************************************
   *                                                                          *
   * `afterDisconnect`                                                        *
   *                                                                          *
   * This custom afterDisconnect function will be run each time a socket      *
   * disconnects                                                              *
   *                                                                          *
   ***************************************************************************/
  // afterDisconnect: function(session, socket, cb) {
  //   // By default: do nothing.
  //   return cb();
  // },

  /***************************************************************************
   *                                                                          *
   * `transports`                                                             *
   *                                                                          *
   * A array of allowed transport methods which the clients will try to use.  *
   * On server environments that don't support sticky sessions, the "polling" *
   * transport should be disabled.                                            *
   *                                                                          *
   ***************************************************************************/
  // transports: ["polling", "websocket"]

//https://github.com/davesag/sails-i18n-example/blob/master/config/sockets.js
//EJEMPLOS INTERESANTE

  // This custom onConnect function will be run each time AFTER a new socket connects
  // (To control whether a socket is allowed to connect, check out `authorization` config.)
  // Keep in mind that Sails' RESTful simulation for sockets
  // mixes in socket.io events for your routes and blueprints automatically.


  afterDisconnect: function(session, socket, cb) {

    //Session del socket cerrado,
    Session.findOne({socket_id: socket.id}).populate('rooms').exec(function (err, session) {
      if (err) return cb();

      if (!session) {
        Robot.findOne({socket_id: socket.id}, function foundSession(err, robot) {
          if (err) return next(err);
          if (!robot) return cb();

          Robot.update(robot.id, {online: false}, function (err) {
            if (err) return cb(err);

            //Informar a otros clientes (sockets abiertos) que el usuario NO esta logueado
            Robot.publishUpdate(robot.id, {
              loggedIn: false,
              id: robot.id
            });
          });
        });
      } else {
        console.log('Cliente Usuario desconectado - id del socket: ' + socket.id);

        //Comprobar si el soscket estaba usando algun robot para liberarlo:
        if (session.robot_id) {
          console.log('Socked was using a robot');

          Robot.update({id: session.robot_id}, {busy: false}, function robotUpdated(err) {
            if (err) return next(err);

            //Informar a otros clientes (sockets abiertos) que el robot queda liberado
            Robot.publishUpdate(session.robot_id, {
              busy: false,
              id: session.robot_id
            });
          });
        }

        //Emite a cada room que un usuario la ha abandonado ->  abandona la room
        session.rooms.forEach(function (room) {
          //sails.sockets.leave(session.socket_id, room.room_name, function(err) {
          //  if (err) {return res.serverError(err);}
          //});
          sails.sockets.broadcast(room.room_name, {type: 'exit', msg: {user_id: session.user_id}});
        });


        //Comprobar si el usuario tiene mas sockets abiertos:
        Session.count({user_id: session.user_id}).exec(function countUserSessions(error, n_sessions) {
          console.log('There are ' + n_sessions + ' users ' + session.user_id);

          //Cambiar usuario a offline
          if (n_sessions == 1) {
            User.update(session.user_id, {online: false}, function (err) {
              if (err) return cb(err);

              //Informar a otros clientes (sockets abiertos) que el usuario NO esta logueado
              User.publishUpdate(session.user_id, {
                loggedIn: false,
                id: session.user_id
              });
            });
          }

          Session.destroy(session.id, function sessionDestroyed(err) {
            if (err) return cb();
            return cb();
          });
        });
      }
    });
  }

};

