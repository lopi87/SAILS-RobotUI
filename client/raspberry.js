// Serial functions
const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;
const port = new SerialPort('/dev/ttyACM0', {
  baudRate: 9600
});

const parser = new Readline();
port.pipe(parser);

var io_client = require('../node_modules/socket.io-client');
var sails_client = require('../node_modules/sails.io.js');
var io_server = sails_client(io_client);
// io_server.sails.url = 'http://192.168.1.135:1337';
io_server.sails.url = 'http://localhost:1337';
io_server.socket.get('/robot/changetoonline/', {robot: '5b64917f7510da0d68a140ec', online: true});


// Inicia servidor socket.io en el puerto 8085.
var io = require('../node_modules/socket.io').listen(8085, { log: false });

// Inicia servidor socket.io para vídeo en el puerto 3535.
var io_video = require('../node_modules/socket.io').listen(3535, { log: false });

// Carga de módulos necesarios.
var ffmpeg_command, running_camera = false, child_process = require('child_process');

// var Gpio = require('../node_modules/pigpio').Gpio;
// Pines utilizados. Motores izquierdos: 2 y 3, motores derechos: 17 y 27
// var gpio2 = new Gpio(2, {mode: Gpio.OUTPUT}),
//   gpio3 = new Gpio(3, {mode: Gpio.OUTPUT}),
//   gpio17 = new Gpio(17, {mode: Gpio.OUTPUT}),
//   gpio27 = new Gpio(27, {mode: Gpio.OUTPUT});


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


  socket.on('start-stream', function() {
    startStreaming(socket);
  });

  socket.emit('robotmsg', {msg: "¡¡¡Bienvenido!!!"});
  console.log('emitiendo: ' + "¡¡¡Bienvenido!!!");

  socket.on('action', function (data){

    console.log('Comando recibido: ' + data);

    switch(data) {
      case 'ON':
        setTimeout(function() {
          // Sending String character by character
          for(var i=0; i<data.length; i++){
            port.write(new Buffer(data[i], 'ascii'), function(err, results) {
              // console.log('Error: ' + err);
              // console.log('Results ' + results);
            });
          }
          // Sending the terminate character
          port.write(new Buffer('\n', 'ascii'), function(err, results) {
            // console.log('err ' + err);
            // console.log('results ' + results);
          });
        },1500);

      case 'OFF':
        setTimeout(function() {
          // Sending String character by character
          for(var i=0; i<data.length; i++){
            port.write(new Buffer(data[i], 'ascii'), function(err, results) {
              // console.log('Error: ' + err);
              // console.log('Results ' + results);
            });
          }
          // Sending the terminate character
          port.write(new Buffer('\n', 'ascii'), function(err, results) {
            // console.log('err ' + err);
            // console.log('results ' + results);
          });
        },1500);

      case 'UP':
        // gpio2.digitalWrite(1);
        // gpio3.digitalWrite(0);
        // gpio17.digitalWrite(1);
        // gpio27.digitalWrite(0);
        console.log('UP');
        break;

      case 'RIGHT':
        // gpio2.digitalWrite(0);
        // gpio3.digitalWrite(0);
        // gpio17.digitalWrite(1);
        // gpio27.digitalWrite(0);
        console.log('UP');
        break;

      case 'LEFT':
        // gpio2.digitalWrite(1);
        // gpio3.digitalWrite(0);
        // gpio17.digitalWrite(0);
        // gpio27.digitalWrite(0);
        console.log('UP');
        break;

      case 'DOWN':
        // gpio2.digitalWrite(0);
        // gpio3.digitalWrite(1);
        // gpio17.digitalWrite(0);
        // gpio27.digitalWrite(1);
        console.log('UP');
        break;

      case 'STOP':
        // gpio2.digitalWrite(0);
        // gpio3.digitalWrite(0);
        // gpio17.digitalWrite(0);
        // gpio27.digitalWrite(0);
        console.log('UP');
        break;

      default:
        console.log('command not found');
    }

  })
});

io_video.sockets.on('connection', function (socket) {
  console.log('Video socket oppened');

  socket.on('disconnect', function() {
    console.log('¡Video desconectado!');
    //stopStreaming(socket);
  });

  socket.on('video_canvas', function() {
    startStreaming(socket);
  });

});


function stopStreaming(socket) {
  delete sockets[socket.id];
  // no more sockets, kill the stream
  if (Object.keys(sockets).length == 0) {
    if (ffmpeg_command){
      ffmpeg_command.kill();
      running_camera = false;
      console.log('Stop streaming');
    }
  }
}

function startStreaming(socket) {
  //ffmpeg -f video4linux2 -i /dev/video0 -s 300x150 -f mjpeg pipe:1 -b:v 28k -bufsize 28k

  if (running_camera == false){
    console.log('Starting streaming....');
    var args = ["-f", "video4linux2", "-i", "/dev/video0", "-s", "300x150","-f","mjpeg", "pipe:1", "-b:v 16k", "-bufsize 28k"]
    ffmpeg_command = child_process.spawn("ffmpeg", args);
    running_camera = true
  }

  ffmpeg_command.on('error', function(err, stdout, stderr) {
    console.log("ffmpeg stdout:\n" + stdout);
    console.log("ffmpeg stderr:\n" + stderr);
    running_camera = false
  });


  ffmpeg_command.on('close', function (code) {
    console.log('ffmpeg exited' + code );
    running_camera = false
  });


  ffmpeg_command.stderr.on('data', function (data) {
    //console.log('stderr: ' + data);
  });

  ffmpeg_command.on('end', function() {
    console.log('Fin');
    running_camera = false
  });

  ffmpeg_command.stdout.on('data', function (data) {
    //console.log('stdout: ' + data);
    var frame = new Buffer(data).toString('base64');
    socket.emit('video_canvas',frame);
  });

}
