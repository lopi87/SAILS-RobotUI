// Start a socket.io server that listens on port 8085.
var io = require('./node_modules/socket.io').listen(8085, { log: false });

// Load required modules.
var sys = require('util'), exec = require('child_process').exec,
  path = require('path'), spawn = require('child_process').spawn, ffmpeg_command;


// Path to Raspbian's gpio driver, used for sending signals to the remote.
var path = '/sys/class/gpio/',

// Pin numbers on the Raspberry Pi connected to the car's remote.
pins = [7, 8, 9, 11];

// Enable sending signals to the car's remote control
// which is connected to the Raspberry Pi.
//initPins()


console.log('Waiting connection...');

var sockets = {};

io.sockets.on('connection', function (socket)
{

  sockets[socket.id] = socket;

  console.log("Total clients connected : ", Object.keys(sockets).length);

  socket.on('disconnect', function() {
    stopStreaming(socket);
  });


  socket.on('start-stream', function() {
    console.log('Start stream....');
    startStreaming(socket);
  });


  socket.emit('robotmsg', {msg: "HELLO!!!"});
  console.log('emit: ' + "HELLO!!!");



  // Listen for direction messages from the app.
  socket.on('direction', function (data)
  {
    console.log('received direction: ' + data);

    // Choose the right command for sending a signal to the car's remote.
    command = '';
    if ( data === 'UP' )
      console.log(data);
    //command = 'echo 1 > ' + path + 'gpio7/value'
    else if ( data === 'DOWN' )
    //command = 'echo 1 > ' + path + 'gpio8/value'
      console.log(data);
    else if ( data === 'LEFT' )
    //command = 'echo 1 > ' + path + 'gpio9/value'
      console.log(data);
    else if ( data === 'RIGHT' )
    //command = 'echo 1 > ' + path + 'gpio11/value'
      console.log(data);
    else if ( data === 'STOPUP' )
    //command = 'echo 0 > ' + path + 'gpio7/value'
      console.log(data);
    else if ( data === 'STOPDOWN' )
    //command = 'echo 0 > ' + path + 'gpio8/value'
      console.log(data);
    else if ( data === 'STOPLEFT' )
    //command = 'echo 0 > ' + path + 'gpio9/value'
      console.log(data);
    else if ( data === 'STOPRIGHT' )
    //command = 'echo 0 > ' + path + 'gpio11/value'
      console.log(data);
    else
      console.log(data);


    // Execute the command to send the signal to the car's remote.
    exec(command, function (error, stdout, stderr)
    {
      if (error !== null)
        console.log('exec error: ' + error);
    })

  })




});





function stopStreaming(socket) {
    delete sockets[socket.id];
    console.log('Client desconected');
    // no more sockets, kill the stream
    if (Object.keys(sockets).length == 0) {
      if (ffmpeg_command) ffmpeg_command.kill();
    }
}


function startStreaming(socket) {


	console.log('Streaming....');

	var args = ["-f", "video4linux2", "-i", "/dev/video0", "-s", "400x300","-f","mjpeg", "pipe:1"]

	ffmpeg_command = require('child_process').spawn("ffmpeg", args);

	ffmpeg_command.on('error', function(err, stdout, stderr) {
	  console.log("ffmpeg stdout:\n" + stdout);
	  console.log("ffmpeg stderr:\n" + stderr);
	  throw err;
	});


	ffmpeg_command.on('close', function (code) {
		console.log('ffmpeg exited with code ' + code);
	});

	ffmpeg_command.stderr.on('data', function (data) {
		//console.log('stderr: ' + data);
	});


	ffmpeg_command.stdout.on('data', function (data) {
		//console.log("stream data");
		var frame = new Buffer(data).toString('base64');
		socket.emit('canvas',frame);
	});

}









function initPins()
{
	// Enable control of the Raspberry Pi's gpio pins.
	for (var pin in pins)
	{
		console.log('Creating port ' + pins[pin] + '...');

		// The command first checks whether the port already exists.
		var command = 'if (! [ -f ' + path + 'gpio' + pins[pin] + '/direction ]); then ' +
			'echo ' + pins[pin] + ' > ' + path + 'export; fi';

		// Create the ports using Raspbian's command line.
		exec(command, function(error, stdout, stderr)
		{
			if (error === null)
				console.log('Successfully created port.');
			else
				console.log('Error when creating port: ' + error + ' (' + stderr + ').');
		})
	}

	// Configure the Raspberry Pi's gpio pins as output ports which enables signals
	// to be sent to the car's remote control.
	for (var pin in pins)
	{
		console.log('Configuring port ' + pins[pin] + '...');

		// The command configures the pin as an output port.
		var command = 'echo out > ' + path + 'gpio' + pins[pin] + '/direction';

		// Configure the ports using Raspbian's command line.
		exec(command, function(error, stdout, stderr)
		{
			if (error === null)
				console.log('Successfully configured pin.');
			else
				console.log('Error when configuring port: ' + error + ' (' + stderr + ').');
		})
	}
}






