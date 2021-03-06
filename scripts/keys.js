// Keyboard handling helper variable for reading the status of keys
var currentlyPressedKeys = {};


//
// Keyboard handling helper functions
//
// handleKeyDown    ... called on keyDown event
// handleKeyUp      ... called on keyUp event
//
function handleKeyDown(event) {
  // storing the pressed state for individual key
  if (event.keyCode === 77) {
    toggleMouseMove(); // Switching the M for on off
  }
  currentlyPressedKeys[event.keyCode] = true;
}

function handleKeyUp(event) {
  // reseting the pressed state for individual key
  currentlyPressedKeys[event.keyCode] = false;
}

//
// handleKeys
//
// Called every time before redeawing the screen for keyboard
// input handling. Function continuisly updates helper variables.

function handleKeys() {
  if (currentlyPressedKeys[74]) {
    // Page Up
    pitchRate = 0.1;
  } else if (currentlyPressedKeys[75]) {
    // Page Down
    pitchRate = -0.1;
  } else {
    pitchRate = 0;
  }

  if (currentlyPressedKeys[37] || currentlyPressedKeys[65]) {
    // Left cursor key or A
    pyramids[0].move(-1, 0);
  } else if (currentlyPressedKeys[39] || currentlyPressedKeys[68]) {
    // Right cursor key or D
    pyramids[0].move(1, 0);
  } 

  if (currentlyPressedKeys[38] || currentlyPressedKeys[87]) {
    // Up cursor key or W
    pyramids[0].move(0, -1);
  } else if (currentlyPressedKeys[40] || currentlyPressedKeys[83]) {
    // Down cursor key
    pyramids[0].move(0, 1);
  } 
}