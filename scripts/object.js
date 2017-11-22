function PlayerObject(type, xPos, yPos, r, g, b) {
  // this.type = type;
  this.type = 'PYR';
  this.height = -0.6;
  this.xPos = xPos;
  this.yPos = yPos;
  this.r = 1;
  this.g = 1;
  this.b = 1;
  this.texturesLoaded = false;
}

PlayerObject.prototype.draw = function () {

  switch (this.type) {
    case 'PYR':
      this.texture = pyrTexture;
      break;
  
    default:
      break;
  }

  mvPushMatrix();

  if (this.type === 'PYR') {
    // Rotating around z axis for 180 degrees (flipping upside down)
    mat4.rotate(mvMatrix, degToRad(180), [0, 0, 1]);
  }

  mat4.translate(mvMatrix, [this.xPos, this.height, this.yPos]);

  gl.uniform3f(shaderProgram.colorUniform, this.r, this.g, this.b);
  
  this.initBuffer();

  // risi
  this.drawPlayerObject();

  mvPopMatrix();
}

PlayerObject.prototype.initBuffer = function() {
  // Create a buffer for the square placeholder's vertices.
  this.friendlyPlayerVertexPositionBuffer = gl.createBuffer();
  
  // Select the friendlyPlayerVertexPositionBuffer as the one to apply vertex
  // operations to from here out.
  gl.bindBuffer(gl.ARRAY_BUFFER, this.friendlyPlayerVertexPositionBuffer);
  
  // Now create an array of vertices for the pyr placeholder.
  
  // pyramid vertices
  this.vertices = [
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
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
  this.friendlyPlayerVertexPositionBuffer.itemSize = 3;
  this.friendlyPlayerVertexPositionBuffer.numItems = 12;

  // Map the texture onto the square placeholder's faces.
  this.friendlyPlayerVertexTextureCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.friendlyPlayerVertexTextureCoordBuffer);
  
  // Now create an array of vertex texture coordinates for the pyramid.
  // TODO: Implement
  this.textureCoordinates = [
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
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.textureCoordinates), gl.STATIC_DRAW);
  this.friendlyPlayerVertexTextureCoordBuffer.itemSize = 3;
  this.friendlyPlayerVertexTextureCoordBuffer.numItems = 4;
}

PlayerObject.prototype.drawPlayerObject = function(playerTexture) {
  // Activate texture
  gl.activeTexture(gl.TEXTURE0);
  // Bind texture
  gl.bindTexture(gl.TEXTURE_2D, pyrTexture);
  gl.uniform1i(shaderProgram.samplerUniform, 0);

  // Set the texture coordinates attribute for the vertices.
  gl.bindBuffer(gl.ARRAY_BUFFER, this.friendlyPlayerVertexTextureCoordBuffer);
  gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, this.friendlyPlayerVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

  // Draw friendlyPlayers by binding the array buffer to the star's vertices
  // array, setting attributes, and pushing it to GL.
  gl.bindBuffer(gl.ARRAY_BUFFER, this.friendlyPlayerVertexPositionBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.friendlyPlayerVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

  // Draw the star.
  setMatrixUniforms();
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.friendlyPlayerVertexPositionBuffer.numItems);
}
