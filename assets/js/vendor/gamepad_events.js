
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
    console.log('btn_pressed');
  } else if (buttonPressed(gp.buttons[2])) {
    console.log('btn_pressed');
  }
  if (buttonPressed(gp.buttons[1])) {
    console.log('btn_pressed');
  } else if (buttonPressed(gp.buttons[3])) {
    console.log('btn_pressed');
  }

  console.log('loop....');

}

