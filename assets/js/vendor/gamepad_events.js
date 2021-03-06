
function gamepad_observer( socket ) {
  // var gamepadInfo = document.getElementById("gamepad-info");
  window.addEventListener("gamepadconnected", function(e) {

    console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
      e.gamepad.index, e.gamepad.id,
      e.gamepad.buttons.length, e.gamepad.axes.length);

    // var gp = navigator.getGamepads()[e.gamepad.index];
    // gamepadInfo.innerHTML = "Gamepad connected at index " + gp.index + ": " + gp.id + ". It has " + gp.buttons.length + " buttons and " + gp.axes.length + " axes.";

    setInterval(function(){ ifaceLoop( socket ); }, 10);
  });

  window.addEventListener("gamepaddisconnected", function(e) {
    // gamepadInfo.innerHTML = "Waiting for gamepad.";
    console.log("Waiting for gamepad.");
  });

}

function buttonPressed(b) {
  if (typeof(b) == "object") {
    return b.pressed;
  }
  return b == 1.0;
}

function ifaceLoop( socket ) {
  var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
  if (!gamepads) {
    console.log('no gamepads');
    return;
  }
  var gp = gamepads[0];
  reportOnGamepad(gp, socket);
}


function reportOnGamepad(gp, socket) {

  for(var i=0;i<gp.buttons.length;i++) {
    if(gp.buttons[i].pressed){
      console.log(gp.buttons[i]);
      socket.emit('pad_action', i);
    }
  }

  gp.buttonsStatus = [];

  data = { x: gp.axes[0], y: gp.axes[1] };
  socket.emit('axes_action_a', data );
  data = { x: gp.axes[2], y: gp.axes[3] };
  socket.emit('axes_action_b', data );

}

