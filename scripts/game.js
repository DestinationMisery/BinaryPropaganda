/*
*
* GLOBAL VARIABLES DECLARATIONS
*
*/

var canvas;
var gl;
var shaderProgram;
abs = Math.abs;

// Buffers
var worldVertexPositionBuffer = null;
var worldVertexTextureCoordBuffer = null;
var friendlyPlayerVertexPositionBuffer;
var friendlyPlayerVertexTextureCoordBuffer;

// Variables for storing textures
var wallTexture;
var friendlyPlayers = [];
var playerTexture;

// Helper variables for animation
var lastTime = 0;
var effectiveFPMS = 60 / 1000;

// Variable that stores  loading state of textures.
var texturesLoaded = false;

// Helper variable for animation
var lastTime = 0;

/*
*
* ANIMATION FUNCTIONS
*
*/


// Global variable for the hover effect (to know when to switch direction of movement (up/down))
var framesPassed = 0;

//
// animate
//
// Called every time before redeawing the screen.
//
function animate() {
  var timeNow = new Date().getTime();
  if (lastTime != 0) {
    var elapsed = timeNow - lastTime;
    framesPassed++;
    if (framesPassed > 100) {
      framesPassed = 0;
    }

    if (speed != 0) {
      xPosition -= Math.sin(degToRad(yaw)) * speed * elapsed;
      zPosition -= Math.cos(degToRad(yaw)) * speed * elapsed;

    }

    for (var i in friendlyPlayers) {
      friendlyPlayers[i].hover(framesPassed);
    }

    yaw += yawRate * elapsed;
    pitch += pitchRate * elapsed;

  }
  lastTime = timeNow;
}

canvasSizeX = 1280;
canvasSizeY = 720;

playgroundSizeX = 5;
playgroundSizeY = 5;

//
// start
//
// Called when the canvas is created to get the ball rolling.
// Figuratively, that is. There's nothing moving in this demo.
//
function start() {
  canvas = document.getElementById("glcanvas");
  gl = initGL(canvas);      // Initialize the GL context

  // Only continue if WebGL is available and working
  if (gl) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);                      // Set clear color to black, fully opaque
    gl.clearDepth(1.0);                                     // Clear everything
    gl.enable(gl.DEPTH_TEST);                               // Enable depth testing
    gl.depthFunc(gl.LEQUAL);                                // Near things obscure far things

    // Initialize the shaders; this is where all the lighting for the
    // vertices and so forth is established.
    initShaders();
    
    // Next, load and set up the textures we'll be using.
    initWorldTextures();
    initPyramidTextures();

    initPlayerBuffers();

    // Initialise world objects
    loadWorld();
    initPlayerObjects();

    // Bind keyboard handling functions to document handlers
    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;

    // Set up to draw the scene periodically.
    setInterval(function() {
      if (texturesLoaded) { // only draw scene and animate when textures are loaded.
        requestAnimationFrame(animate);
        handleKeys();
        mouseMovePlayground();
        drawScene();
      }
    }, 15);
  }
}