// Inicia servidor socket.io en el puerto 8085.
var io = require('./node_modules/socket.io').listen(8085, { log: false });

// Carga de módulos necesarios.
var sys = require('util'), exec = require('child_process').exec,
  path = require('path'), ffmpeg_command, running_camera = false;


// Ruta a los drivers Gpio de la Raspberry, usado para enviar las señales.
var path = '/sys/class/gpio/';

// Pines utilizados. Motores izquierdos: 2 y 3, motores derechos: 17 y 27
pins = [2, 3, 17, 27];


// Activación de los pines
initPins();

console.log('Waiting connection...');

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

  socket.emit('robotmsg', {msg: "HELLO!!!"});
  console.log('emit: ' + "HELLO!!!");

  socket.on('action', function (data){

    console.log('Comando recibido: ' + data);

    switch(data) {
      case 'UP':
        exec_command( 'echo 1 > ' + path + 'gpio2/value'  );
        exec_command( 'echo 0 > ' + path + 'gpio3/value'  )
        exec_command( 'echo 1 > ' + path + 'gpio17/value' );
        exec_command( 'echo 0 > ' + path + 'gpio27/value' );
        console.log('UP');
        break;

      case 'RIGHT':
        exec_command( 'echo 0 > ' + path + 'gpio2/value'  );
        exec_command( 'echo 0 > ' + path + 'gpio3/value'  );
        exec_command( 'echo 1 > ' + path + 'gpio17/value' );
        exec_command( 'echo 0 > ' + path + 'gpio27/value' );
        break;

      case 'LEFT':
        exec_command( 'echo 1 > ' + path + 'gpio2/value'  );
        exec_command( 'echo 0 > ' + path + 'gpio3/value'  );
        exec_command( 'echo 0 > ' + path + 'gpio17/value' );
        exec_command( 'echo 0 > ' + path + 'gpio27/value' );
        break;


      case 'DOWN':
        exec_command( 'echo 0 > ' + path + 'gpio2/value'  );
        exec_command( 'echo 1 > ' + path + 'gpio3/value'  );
        exec_command( 'echo 0 > ' + path + 'gpio17/value' );
        exec_command( 'echo 1 > ' + path + 'gpio27/value' );
        break;

      case 'STOP':
        exec_command( 'echo 0 > ' + path + 'gpio2/value'  );
        exec_command( 'echo 0 > ' + path + 'gpio3/value'  );
        exec_command( 'echo 0 > ' + path + 'gpio17/value' );
        exec_command( 'echo 0 > ' + path + 'gpio27/value' );
        break;
      default:
        console.log('Comando no encontrado');
    }

  })
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
    var args = ["-f", "video4linux2", "-i", "/dev/video0", "-s", "300x150","-f","mjpeg", "pipe:1", "-b:v 28k", "-bufsize 28k"]
    ffmpeg_command = require('child_process').spawn("ffmpeg", args);
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
    socket.emit('canvas',frame);
  });

}

function initPins()
{
  // Activa control de los Pines Gpio de la Raspberry Pi.
  for (var pin in pins)
  {
    //console.log('Creando puerto ' + pins[pin] + '...');

    // Primeramente comprueba si el puerto ya existe.
    var command = 'if (! [ -f ' + path + 'gpio' + pins[pin] + '/direction ]); then ' +
      'echo ' + pins[pin] + ' > ' + path + 'export; fi';

    // Creación del puerto usando la línea de comandos.
    exec(command, function(error, stdout, stderr)
    {
      if (error === null){
        //console.log('Puerto creado con éxito.');
      }else{
        console.log('Error en la creación del puerto: ' + error + ' (' + stderr + ').');
      }
    })
  }

  // Configuración de los pines GPIO como salida.
  for (var pin in pins)
  {
    //console.log('Configurando puerto ' + pins[pin] + '...');

    // Configurando los puertos como salida.
    var command = 'echo out > ' + path + 'gpio' + pins[pin] + '/direction';

    // Configure the ports using Raspbian's command line.
    exec(command, function(error, stdout, stderr)
    {
      if (error === null){
        //console.log('Puerto configurado con éxito.');
      }else{
        console.log('Error configurando el puerto: ' + error + ' (' + stderr + ').');
      }
    })
  }
}


