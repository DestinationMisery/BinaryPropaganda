/*
*
* PLAYER OBJECT FUNCTIONS
*
*/

// Definition of player object and it's position (possibly also color)
function Player(type, xPos, yPos, r, g, b) {

  this.type = 'PYRAMID'; // or 'CUBE'
  this.xPos = 0;
  this.yPos = -2.0;
  this.height = -0.6;

  this.r = 1;
  this.g = 1;
  this.b = 1;
}

// Function draws individual player object
Player.prototype.draw = function () {

  mvPushMatrix();

  // Rotating around z axis for 180 degrees (flipping upside down)
  mat4.rotate(mvMatrix, degToRad(180), [0, 0, 1]);

  // Move to the player's position
  mat4.translate(mvMatrix, [this.xPos, this.height, this.yPos]);

  // Draw the object in its main color (TODO: Implement)
  gl.uniform3f(shaderProgram.colorUniform, this.r, this.g, this.b);

  drawPlayer();

  mvPopMatrix();
};

// Makes a player object hover
Player.prototype.hover = function (elapsed) {
  if (elapsed < 50) {
    this.height += 0.25/50;
  } else {
    this.height -= 0.25/50;
  }
};

function drawPlayer() {
  // Activate texture
  gl.activeTexture(gl.TEXTURE0);
  // Bind texture
  gl.bindTexture(gl.TEXTURE_2D, playerTexture);
  gl.uniform1i(shaderProgram.samplerUniform, 0);

  // Set the texture coordinates attribute for the vertices.
  gl.bindBuffer(gl.ARRAY_BUFFER, friendlyPlayerVertexTextureCoordBuffer);
  gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, friendlyPlayerVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

  // Draw friendlyPlayers by binding the array buffer to the star's vertices
  // array, setting attributes, and pushing it to GL.
  gl.bindBuffer(gl.ARRAY_BUFFER, friendlyPlayerVertexPositionBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, friendlyPlayerVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

  // Draw the star.
  setMatrixUniforms();
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, friendlyPlayerVertexPositionBuffer.numItems);
}

// Function that moves the player object to a desired position
function movePlayerTo(player, xDesired, zDesired, speed /* from 1 to 1000 */) {
  // move player every frame in the x,y direction until he is there
  var intervalMove = setInterval(function () {
    if (abs(xDesired-player.xPosition) < 0.1 && abs(zDesired-player.zPosition) < 0.1) {
      clearInterval(intervalMove);
    }
    player.xPosition += ((xDesired - player.xPosition) / (1000 / speed));
    player.zPosition += ((zDesired - player.zPosition) / (1000 / speed));
  }, 15);
}

//
// initTextures
//
// Initialize the textures we'll be using, then initiate a load of
// the texture images. The handleTextureLoaded() callback will finish
// the job; it gets called each time a texture finishes loading.
//

function initPyramidTextures() {
  playerTexture = gl.createTexture();
  playerTexture.image = new Image();
  playerTexture.image.onload = function () {
    handleTextureLoaded(playerTexture)
  }
  playerTexture.image.src = "./assets/star.gif";
}

function initPlayerObjects() {
  var numfriendlyPlayers = 1;

  for (var i = 0; i < numfriendlyPlayers; i++) {
    // Create new star and push it to the friendlyPlayers array
    friendlyPlayers.push(new Player((i / numfriendlyPlayers) * 5.0, i / numfriendlyPlayers));
  }
}

function initPlayerBuffers() {
  // Create a buffer for the square placeholder's vertices.
  friendlyPlayerVertexPositionBuffer = gl.createBuffer();
  
  // Select the friendlyPlayerVertexPositionBuffer as the one to apply vertex
  // operations to from here out.
  gl.bindBuffer(gl.ARRAY_BUFFER, friendlyPlayerVertexPositionBuffer);
  
  // Now create an array of vertices for the square placeholder.
  
  // pyramid vertices
  vertices = [
    // Front face
     0.0,  0.25,  0.0,
    -0.25, -0.25,  0.25,
     0.25, -0.25,  0.25,

    // Right face
     0.0,  0.25,  0.0,
     0.25, -0.25,  0.25,
     0.25, -0.25, -0.25,

    // Back face
     0.0,  0.25,  0.0,
     0.25, -0.25, -0.25,
    -0.25, -0.25, -0.25,

    // Left face
     0.0,  0.25,  0.0,
    -0.25, -0.25, -0.25,
    -0.25, -0.25,  0.25
  ];

  // Now pass the list of vertices into WebGL to build the shape. We
  // do this by creating a Float32Array from the JavaScript array,
  // then use it to fill the current vertex buffer.
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  friendlyPlayerVertexPositionBuffer.itemSize = 3;
  friendlyPlayerVertexPositionBuffer.numItems = 12;

  // Map the texture onto the square placeholder's faces.
  friendlyPlayerVertexTextureCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, friendlyPlayerVertexTextureCoordBuffer);
  
  // Now create an array of vertex texture coordinates for the pyramid.
  // TODO: Implement
  var textureCoordinates = [
    // Front face
    1.0, 0.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 1.0,

    // Back face
    1.0, 0.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 1.0,

    // Left face
    1.0, 0.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 1.0,
    0.0, 1.0, 0.0, 1.0,

    // Right face
    1.0, 0.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 1.0,
    0.0, 1.0, 0.0, 1.0
  ];
  // Pass the texture coordinates into WebGL
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);
  friendlyPlayerVertexTextureCoordBuffer.itemSize = 3;
  friendlyPlayerVertexTextureCoordBuffer.numItems = 4;
}