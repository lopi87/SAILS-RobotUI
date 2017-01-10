/*
File: server.js
Description: Evothings Raspberry Car demo app.
Author: Eric Svensson
Copyright (c) 2014 Evothings AB
*/

// Start a socket.io server that listens on port 8085.
var io = require('./node_modules/socket.io').listen(8085, { log: true })

// Load required modules.
var sys = require('util'),
exec = require('child_process').exec

// Path to Raspbian's gpio driver, used for sending signals to the remote.
var path = '/sys/class/gpio/',
// Pin numbers on the Raspberry Pi connected to the car's remote.
	pins = [7, 8, 9, 11];

// Enable sending signals to the car's remote control
// which is connected to the Raspberry Pi.
//initPins()

var sockets = {};

// Listen for connections
io.sockets.on('connection', function (socket)
{

	sockets[socket.id] = socket;
	console.log("Total clients connected : ", Object.keys(sockets).length);

	socket.on('disconnect', function() {
		delete sockets[socket.id];
		console.log("Total clients connected : ", Object.keys(sockets).length);
	});

	var msg = "HELLO!!!";
	socket.emit('robotmsg', {msg: msg});
	console.log('emit: ' + msg);


	var n = "23";
	socket.emit('dist', {msg: n});
	console.log('emit: ' + n);


	// Listen for direction messages from the app.
	socket.on('direction', function (data)
	{
		console.log('received direction: ' + data);

		// Choose the right command for sending a signal to the car's remote.
		command = ''
		if ( data === 'UP' )
			console.log(data)
			//command = 'echo 1 > ' + path + 'gpio7/value'
		else if ( data === 'DOWN' )
			//command = 'echo 1 > ' + path + 'gpio8/value'
			console.log(data)
		else if ( data === 'LEFT' )
			//command = 'echo 1 > ' + path + 'gpio9/value'
			console.log(data)
		else if ( data === 'RIGHT' )
			//command = 'echo 1 > ' + path + 'gpio11/value'
			console.log(data)
		else if ( data === 'STOPUP' )
			//command = 'echo 0 > ' + path + 'gpio7/value'
			console.log(data)
		else if ( data === 'STOPDOWN' )
			//command = 'echo 0 > ' + path + 'gpio8/value'
			console.log(data)
		else if ( data === 'STOPLEFT' )
			//command = 'echo 0 > ' + path + 'gpio9/value'
			console.log(data)
		else if ( data === 'STOPRIGHT' )
			//command = 'echo 0 > ' + path + 'gpio11/value'
			console.log(data)
		else
			console.log(data)


		// Execute the command to send the signal to the car's remote.
		exec(command, function (error, stdout, stderr)
		{
			if (error !== null)
				console.log('exec error: ' + error)
		})

	})

})

function initPins()
{
	// Enable control of the Raspberry Pi's gpio pins.
	// Read more at http://elinux.org/RPi_Low-level_peripherals#Bash_shell_script.2C_using_sysfs.2C_part_of_the_raspbian_operating_system
	for (var pin in pins)
	{
		console.log('Creating port ' + pins[pin] + '...')

		// The command first checks whether the port already exists.
		var command = 'if (! [ -f ' + path + 'gpio' + pins[pin] + '/direction ]); then ' +
			'echo ' + pins[pin] + ' > ' + path + 'export; fi';

		// Create the ports using Raspbian's command line.
		exec(command, function(error, stdout, stderr)
		{
			if (error === null)
				console.log('Successfully created port.')
			else
				console.log('Error when creating port: ' + error + ' (' + stderr + ').')
		})
	}

	// Configure the Raspberry Pi's gpio pins as output ports which enables signals
	// to be sent to the car's remote control.
	// Read more at http://elinux.org/RPi_Low-level_peripherals#Bash_shell_script.2C_using_sysfs.2C_part_of_the_raspbian_operating_system
	for (var pin in pins)
	{
		console.log('Configuring port ' + pins[pin] + '...')

		// The command configures the pin as an output port.
		var command = 'echo out > ' + path + 'gpio' + pins[pin] + '/direction'

		// Configure the ports using Raspbian's command line.
		exec(command, function(error, stdout, stderr)
		{
				if (error === null)
					console.log('Successfully configured pin.')
				else
					console.log('Error when configuring port: ' + error + ' (' + stderr + ').')
		})
	}
}
