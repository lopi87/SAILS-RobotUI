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

console.log('Esperando conexión...');

var sockets = {};

//Servo variables
var y, servo_previous_status = 0;

//Motor vairables
var x, motor_previous_status = 0;


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

  socket.on('axes_action_a', function (data) {

    if(data['y'] > 0){ //derecha
      y = data['y'] * -2 * 100 - 50;
    } else { //izquierda
      y = data['y'] * -2 * 100 + 50;
    }

    if(y >= 49 && y <= 52 ){
      y = 0;
    }

    y = Math.round(y);
    var difference = Math.abs(servo_previous_status - y);
    if( difference > 10){
      servo_previous_status = y;
      serial_transmission('SRV-' + y, 10 );
      console.log(y);
    }

  });

  socket.on('axes_action_b', function (data) {
    if(data['y'] > 0){ //atrás
      y = data['y'] * -2 * 100 - 50;
    } else { //delante
      y = data['y'] * -2 * 100 + 50;
    }
    if(y >= 49 && y <= 52 ){
      y = 0;
    }

    if(y == -51){
      y = 0;
    }

    y = Math.round(y);
    var speed_difference = Math.abs(motor_previous_status - y);
    if( speed_difference > 10){
      motor_previous_status = y;
      serial_transmission('MOTOR-' + y, 10 );
      console.log(y);
    }
  });


  socket.on('pad_action', function (pad_btn) {
    console.log(pad_btn);
    if(pad_btn == 2){
      serial_transmission('H', 10);
    }
    if(pad_btn == 1){
      serial_transmission('L', 10);
    }
  });


  socket.on('action', function (data){
    console.log('Comando recibido: ' + data);
    switch(data) {
      case "H":
        serial_transmission(data, 10);
      case "L":
        serial_transmission(data, 10);
    }

  });


    // const parser = port.pipe(new Readline({ delimiter: '\r\n' }));
    // parser.on('data', console.log);


  const parser = port.pipe(new Readline({ delimiter: '\r\n' }));
  parser.on('data', function(data){
    console.log(data);
    var msg_data = data.split("%");
    socket.emit(String(msg_data[0]), {msg: String(msg_data[1]) } );
  });


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
  // video
  // ffmpeg -f video4linux2 -i /dev/video0 -s 300x150 -f mjpeg pipe:1 -b:v 28k -bufsize 28k

  // video with audio
  // ffmpeg -f alsa -i default -f video4linux2 -i /dev/video0 -s 300x150 -f mjpeg pipe:1 -b:v 28k -bufsize 28k

  // only audio
  // ffmpeg -f alsa -i default -f mpeg pipe:1 -b:v 28k -bufsize 28k


  //ffmpeg -f alsa -i default -acodec libopus -b:a bitrate -vbr on -compression_level 10 -f ogg pipe:1

  //ffmpeg -ac 1 -f alsa -i default -acodec libmp3lame -ab 32k -ac 1 -content_type audio/mpeg -f mp3 out2.mp3

  if (running_camera == false){
    console.log('Starting streaming....');
    var args = ["-f", "video4linux2", "-i", "/dev/video0", "-s", "300x150","-f","mjpeg", "pipe:1", "-b:v 16k", "-bufsize 28k"];

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
    // console.log('stdout: ' + data);
    var frame = new Buffer(data).toString('base64');
    socket.emit('video_canvas',frame);
  });

}

function serial_transmission( data, delay ){
  setTimeout(function() {
    // Sending String character by character
    for(var i=0; i<data.length; i++){
      port.write(new Buffer(data[i], 'ascii'));
    }
    // Sending the terminate character
    port.write(new Buffer('\n', 'ascii'));

  }, delay  );

}
