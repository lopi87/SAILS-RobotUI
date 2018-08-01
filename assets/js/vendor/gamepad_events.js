
function gamepad_observer() {

  // var gamepadInfo = document.getElementById("gamepad-info");
  window.addEventListener("gamepadconnected", function(e) {

    console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
      e.gamepad.index, e.gamepad.id,
      e.gamepad.buttons.length, e.gamepad.axes.length);

    var gp = navigator.getGamepads()[e.gamepad.index];
    // gamepadInfo.innerHTML = "Gamepad connected at index " + gp.index + ": " + gp.id + ". It has " + gp.buttons.length + " buttons and " + gp.axes.length + " axes.";

    ifaceLoop();
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

function ifaceLoop() {
  var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
  if (!gamepads) {
    console.log('no gamepads');
    return;
  }

  var gp = gamepads[0];
  if (buttonPressed(gp.buttons[0])) {
    console.log('btn 3 pressed');
  } else if (buttonPressed(gp.buttons[2])) {
    console.log('btn 2 pressed');
  }
  if (buttonPressed(gp.buttons[1])) {
    console.log('btn 1 pressed');
  } else if (buttonPressed(gp.buttons[3])) {
    console.log('btn 3 pressed');
  }

  reportOnGamepad(gp);
  start = requestAnimationFrame(ifaceLoop);
}


function reportOnGamepad(gp) {
  for(var i=0;i<gp.buttons.length;i++) {
    if(gp.buttons[i].pressed){
      console.log('pressed')
    }
  }
  for(var i=0;i<gp.axes.length; i+=2) {
    console.log("Stick "+(Math.ceil(i/2)+1)+": "+gp.axes[i]+","+gp.axes[i+1]);
  }

}


function send_action(btn){

}
