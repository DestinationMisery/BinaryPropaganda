// Model-view and projection matrix and model-view matrix stack
var mvMatrixStack = [];
var mvMatrix = mat4.create();
var pMatrix = mat4.create();

// Variables for storing current position and speed
var pitch = -35;
var pitchRate = 0;
var yaw = 0;
var yawRate = 0;
var xPosition = 0;
var yPosition = 7;
var zPosition = 0;
var speed = 0;

// Function that moves the camera to a desired position
function moveTo(xDesired, zDesired, speed /* from 1 to 1000 */) {
  // move player every frame in the x,y direction until he is there
  var intervalMove = setInterval(function () {
    if (abs(xDesired-xPosition) < 0.1 && abs(zDesired-zPosition) < 0.1) {
      clearInterval(intervalMove);
    }
    xPosition += ((xDesired - xPosition) / (1000 / speed));
    zPosition += ((zDesired - zPosition) / (1000 / speed));
  }, 15);
}