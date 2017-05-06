// Start a socket.io server that listens on port 8085.
var io = require('./node_modules/socket.io').listen(8085, { log: false });

// Load required modules.
var sys = require('util'), exec = require('child_process').exec,
  path = require('path'), ffmpeg_command, running_camera = false;


// Path to Raspbian's gpio driver, used for sending signals to the remote.
var path = '/sys/class/gpio/',

// Pin numbers on the Raspberry Pi connected to the car's remote.
  pins = [2, 3, 17, 27];
// motor 1: 2 y 3
// motor 2: 17 y 27

// Enable sending signals to the car's remote control
// which is connected to the Raspberry Pi.
initPins()


console.log('Waiting connection...');

var sockets = {};

io.sockets.on('connection', function (socket)
{

  sockets[socket.id] = socket;
  console.log("Total clients connected : ", Object.keys(sockets).length);

  socket.on('disconnect', function() {
    console.log('Bye!')
    //stopStreaming(socket);
  });


  socket.on('start-stream', function() {
    startStreaming(socket);
  });

  socket.emit('robotmsg', {msg: "HELLO!!!"});
  console.log('emit: ' + "HELLO!!!");

  socket.on('action', function (data){

    console.log('received action: ' + data);

    switch(data) {
      case 'UP':
        exec_command( 'echo 1 > ' + path + 'gpio2/value'  );
        exec_command( 'echo 0 > ' + path + 'gpio3/value'  )
        exec_command( 'echo 0 > ' + path + 'gpio17/value' );
        exec_command( 'echo 1 > ' + path + 'gpio27/value' );
        console.log('UP');
        break;

      case 'RIGHT':
        exec_command( 'echo 0 > ' + path + 'gpio2/value'  );
        exec_command( 'echo 0 > ' + path + 'gpio3/value'  )
        exec_command( 'echo 1 > ' + path + 'gpio17/value' );
        exec_command( 'echo 0 > ' + path + 'gpio27/value' );
        break;

      case 'LEFT':
        exec_command( 'echo 1 > ' + path + 'gpio2/value'  );
        exec_command( 'echo 0 > ' + path + 'gpio3/value'  )
        exec_command( 'echo 0 > ' + path + 'gpio17/value' );
        exec_command( 'echo 0 > ' + path + 'gpio27/value' );
        break;


      case 'DOWN':
        exec_command( 'echo 0 > ' + path + 'gpio2/value'  );
        exec_command( 'echo 1 > ' + path + 'gpio3/value'  );
        exec_command( 'echo 1 > ' + path + 'gpio17/value' );
        exec_command( 'echo 0 > ' + path + 'gpio27/value' );
        break;

      case 'STOP':
        exec_command( 'echo 0 > ' + path + 'gpio2/value'  );
        exec_command( 'echo 0 > ' + path + 'gpio3/value'  );
        exec_command( 'echo 0 > ' + path + 'gpio17/value' );
        exec_command( 'echo 0 > ' + path + 'gpio27/value' );
        break;
      default:
        console.log('command not found');
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
    console.log('Finished');
    running_camera = false
  });

  ffmpeg_command.stdout.on('data', function (data) {
    //console.log('stdout: ' + data);
    var frame = new Buffer(data).toString('base64');
    socket.emit('canvas',frame);
  });

}
