/*
*
* MOUSE MOVEMENT FUNCTIONS
*
*/

var mouseMoveEngaged = true;
function toggleMouseMove() {
  mouseMoveEngaged = !mouseMoveEngaged;
  if (mouseMoveEngaged) {
    $("#mouseLockState").html("ON")
    $("#mouseLockState").css("color", "#00ff00")
  } else {
    $("#mouseLockState").html("OFF")
    $("#mouseLockState").css("color", "#ff0000")
  }
}

// Gets mouse coordinates relative to the canvas
function relMouseCoords(event){
  var totalOffsetX = 0;
  var totalOffsetY = 0;
  var canvasX = 0;
  var canvasY = 0;
  var currentElement = this;

  do{
      totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
      totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
  }
  while(currentElement = currentElement.offsetParent)

  canvasX = event.pageX - totalOffsetX;
  canvasY = event.pageY - totalOffsetY;

  return {x:canvasX, y:canvasY}
}
HTMLCanvasElement.prototype.relMouseCoords = relMouseCoords;

// Setting functions for mousemove (what mouse move should do)
document.addEventListener('mousemove', onMouseUpdate, false);
document.addEventListener('mouseenter', onMouseUpdate, false);

// Global variables where the mouse is
var mouseX = null;
var mouseY = null;
function onMouseUpdate(e) {
    mouseX = e.pageX;
    mouseY = e.pageY;
}

function getMouseX() {
    return x;
}
function getMouseY() {
    return y;
}

// Function that changes the camera's position according to the mouse position
var mouseMoveSpeed = 0.08;
function mouseMovePlayground(e) {
  var marginLeft = $("#glcanvas").offset().left;
  var marginTop = 100;
 
  if (mouseMoveEngaged) {
    var outLeft = mouseX < marginLeft;
    var outUp = mouseY < marginTop;
    var outRight = mouseX > marginLeft + canvasSizeX;
    var outDown = mouseY > marginTop + canvasSizeY;
    
    if (outLeft) {
      xPosition -= mouseMoveSpeed;
      if(xPosition < -19.0) // stop camera from moving over borders
        xPosition += mouseMoveSpeed;
    }
    if (outUp) {
      zPosition -= mouseMoveSpeed;
      if(zPosition < -10.0)
        zPosition += mouseMoveSpeed;
    }
    if (outRight) {
      xPosition += mouseMoveSpeed;
      if(xPosition > 19.0)
        xPosition-= mouseMoveSpeed;
    }
    if (outDown) {
      zPosition += mouseMoveSpeed;
      if(zPosition > 30.0)
        zPosition -= mouseMoveSpeed;
    }

  }
}

// Doesn't yet work
function handleClicks(e) {
  
    // get pos of click
    coords = canvas.relMouseCoords(event);
    // TODO: Transform coordinates with raycasting
    var transformedX = 0;
    var transformedZ = 0;
  
    moveTo(transformedX, transformedZ, 200);
  }