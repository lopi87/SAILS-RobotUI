// Serial functions
var io_client = require('../node_modules/socket.io-client');
var sails_client = require('../node_modules/sails.io.js');
var io_server = sails_client(io_client);
io_server.sails.url = 'http://127.0.0.1:1337';
//io_server.sails.url = 'http://localhost:1337';
io_server.socket.get('/robot/changetoonline/', {robot: '5b64917f7510da0d68a140ec', online: true});


// Inicia servidor socket.io en el puerto 8085.
var io = require('../node_modules/socket.io').listen(8085, { log: false });

// Inicia servidor socket.io para audio en el puerto 3535.
var io_audio = require('../node_modules/socket.io').listen(3535, { log: false });

var mic = require('../node_modules/mic');
const context = require('audio-context');
const Generator = require('audio-generator');
const {Readable, Writable} = require('web-audio-stream/stream');


console.log('Esperando conexión...');

var sockets = {};

io.sockets.on('connection', function (socket)
{
  sockets[socket.id] = socket;
  console.log("Clientes totales conectados: ", Object.keys(sockets).length);

  socket.on('disconnect', function() {
    console.log('¡Adios!');
    //stopStreaming(socket);
  });


  const micInstance = mic({ // arecord -D hw:0,0 -f S16_LE -r 44100 -c 2
    encoding: 'signed-integer', //             -f S
    bitwidth: '16',             //                 16
    endian: 'little',           //                   _LE
    rate: '44100',              //                       -r 44100
    channels: '1',              //                                -c 2
    debug: true,
    exitOnSilence: 500
  });
  var micInputStream = micInstance.getAudioStream();
  var outputFileStream = fs.WriteStream('/output.raw');
  micInputStream.pipe(outputFileStream);


  io_audio.sockets.on('connection', function (socket) {

    micInputStream.on('data', (audioBuffer) => {
      console.log("Recieved Input Stream: " + audioBuffer.length);
      audioBuffer.getChannelData(0)
      // socket.emit('video_canvas', data);
    });

    micInputStream.on('error', err => {
      cosole.log("Error in Input Stream: " + err)
    });

    micInstance.start();

    var stream = ss.createStream();
    var filename = __dirname + '/output.raw';
    ss(socket).emit('video_canvas', stream, { name: filename });
    fs.createReadStream(filename).pipe(stream);


  });



});

