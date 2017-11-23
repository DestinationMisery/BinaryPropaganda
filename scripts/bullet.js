function Bullet(type, speed, scale, xPos, yPos, zPos, xDir, yDir, zDir, enemies) {
    this.type = type;
    this.speed = speed;
    this.scale = scale;
    this.xPos = xPos;
    this.yPos = yPos;
    this.zPos = zPos;

    this.xDir = xDir;
    this.yDir = yDir;
    this.zDir = zDir;

    const vecLength = Math.sqrt( Math.pow( this.xDir, 2) + Math.pow( this.yDir, 2) + Math.pow( this.zDir, 2) );
    this.xDir = xDir / vecLength;
    this.yDir = yDir / vecLength;
    this.zDir = zDir / vecLength;

    this.enemies = enemies;

    this.rotX = 0;
    this.rotY = 0;
    this.rotZ = 0;

    this.lifetime = 3000;
    this.shot = new Date().getTime();

    this.friendlyPlayerVertexPositionBuffer = gl.createBuffer();
    this.friendlyPlayerVertexTextureCoordBuffer = gl.createBuffer();
    this.cubeVertexPositionBuffer = gl.createBuffer();
    this.cubeVertexColorBuffer = gl.createBuffer();
    this.cubeVertexIndexBuffer = gl.createBuffer();
}

Bullet.prototype.move = function () {

  this.xPos += this.xDir * this.speed;
  this.yPos += this.yDir * this.speed;
  this.zPos += this.zDir * this.speed;

  this.rotX += 10;
  this.rotY += 10;

  const iAmTooOld = new Date().getTime() - this.shot >= this.lifetime;

  if (iAmTooOld) {
    bullets.shift();
  }

  this.checkCollisions();
}

Bullet.prototype.checkCollisions = function() {

  this.enemies.forEach((enemy) => {
    const distance = Math.sqrt( Math.pow( enemy.xPos - this.xPos, 2) + Math.pow( enemy.yPos - this.yPos, 2) + Math.pow( enemy.zPos - this.zPos, 2) )
    const radiusSum = this.scale + enemy.scale;
    if (distance < radiusSum) {
      enemy.health -= 1;
      this.destroy();
      if (enemy.health == 0) {
        enemy.destroy();
      }
    }
  });
}

Bullet.prototype.destroy = function () {
  const indexInArray = bullets.indexOf(this);
  bullets.splice(indexInArray, 1);
}

Bullet.prototype.draw = function () {

  switch (this.type) {
    case 'PYR':
      gl.useProgram(shaderProgram);
      this.setPyrVerticesAndTextureCoordinates();
      break;

    case 'CUBE':
      gl.useProgram(shaderCubeProgram);
      this.setCubeVerticesAndTextureCoordinates();
      break;
  
    default:
      break;
  }

  mvPushMatrix();


  mat4.translate(mvMatrix, [this.xPos, this.yPos, this.zPos]);  

  mat4.rotate(mvMatrix, degToRad(this.rotX), [1, 0, 0]);
  mat4.rotate(mvMatrix, degToRad(this.rotY), [0, 1, 0]);
  mat4.rotate(mvMatrix, degToRad(this.rotZ), [0, 0, 1]);
  
  switch (this.type) {
    case 'PYR':
      this.initPyramidBuffer();
      this.drawPyrPlayerObject();
      break;

    case 'CUBE':
      this.initCubeBuffer();
      this.drawCubePlayerObject();
      break;

    default:
      break;
  }

  mvPopMatrix();
}

Bullet.prototype.setPyrVerticesAndTextureCoordinates = function() {
  // pyramid vertices
  this.vertices = [
    // Front face
     0.0,  this.scale,  0.0,
    -this.scale, -this.scale,  this.scale,
     this.scale, -this.scale,  this.scale,

    // Right face
     0.0,  this.scale,  0.0,
     this.scale, -this.scale,  this.scale,
     this.scale, -this.scale, -this.scale,

    // Back face
     0.0,  this.scale,  0.0,
     this.scale, -this.scale, -this.scale,
    -this.scale, -this.scale, -this.scale,

    // Left face
     0.0,  this.scale,  0.0,
    -this.scale, -this.scale, -this.scale,
    -this.scale, -this.scale,  this.scale
  ];
  this.texture = pyrTexture; // pulled from the global scope of the initally setup textures
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
}

Bullet.prototype.setCubeVerticesAndTextureCoordinates = function() {
  // pyramid vertices
  this.vertices = [
    // Front face
    -this.scale, -this.scale,  this.scale,
     this.scale, -this.scale,  this.scale,
     this.scale,  this.scale,  this.scale,
    -this.scale,  this.scale,  this.scale,

    // Back face
    -this.scale, -this.scale, -this.scale,
    -this.scale,  this.scale, -this.scale,
     this.scale,  this.scale, -this.scale,
     this.scale, -this.scale, -this.scale,

    // Top face
    -this.scale,  this.scale, -this.scale,
    -this.scale,  this.scale,  this.scale,
     this.scale,  this.scale,  this.scale,
     this.scale,  this.scale, -this.scale,

    // Bottom face
    -this.scale, -this.scale, -this.scale,
     this.scale, -this.scale, -this.scale,
     this.scale, -this.scale,  this.scale,
    -this.scale, -this.scale,  this.scale,

    // Right face
     this.scale, -this.scale, -this.scale,
     this.scale,  this.scale, -this.scale,
     this.scale,  this.scale,  this.scale,
     this.scale, -this.scale,  this.scale,

    // Left face
    -this.scale, -this.scale, -this.scale,
    -this.scale, -this.scale,  this.scale,
    -this.scale,  this.scale,  this.scale,
    -this.scale,  this.scale, -this.scale,
  ];
  this.texture = pyrTexture; // pulled from the global scope of the initally setup textures
  this.colors = [
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
}

Bullet.prototype.initPyramidBuffer = function() {
  // Create a buffer for the square placeholder's vertices.
  
  
  // Select the friendlyPlayerVertexPositionBuffer as the one to apply vertex
  // operations to from here out.
  gl.bindBuffer(gl.ARRAY_BUFFER, this.friendlyPlayerVertexPositionBuffer);

  // Now pass the list of vertices into WebGL to build the shape. We
  // do this by creating a Float32Array from the JavaScript array,
  // then use it to fill the current vertex buffer.
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
  this.friendlyPlayerVertexPositionBuffer.itemSize = 3;
  this.friendlyPlayerVertexPositionBuffer.numItems = 12;

  // Map the texture onto the square placeholder's faces.
  
  gl.bindBuffer(gl.ARRAY_BUFFER, this.friendlyPlayerVertexTextureCoordBuffer);
  
  // Pass the texture coordinates into WebGL
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.textureCoordinates), gl.STATIC_DRAW);
  this.friendlyPlayerVertexTextureCoordBuffer.itemSize = 3;
  this.friendlyPlayerVertexTextureCoordBuffer.numItems = 4;
}

Bullet.prototype.initCubeBuffer = function() {
  
  
  gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexPositionBuffer);
 
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
  this.cubeVertexPositionBuffer.itemSize = 3;
  this.cubeVertexPositionBuffer.numItems = 24;

  
  gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexColorBuffer);
  colors = [
      [1.0, 0.0, 0.0, 1.0], // Front face
      [1.0, 1.0, 0.0, 1.0], // Back face
      [0.0, 1.0, 0.0, 1.0], // Top face
      [1.0, 0.5, 0.5, 1.0], // Bottom face
      [1.0, 0.0, 1.0, 1.0], // Right face
      [0.0, 0.0, 1.0, 1.0]  // Left face
  ];
  var unpackedColors = [];
  for (var i in colors) {
      var color = colors[i];
      for (var j=0; j < 4; j++) {
          unpackedColors = unpackedColors.concat(color);
      }
  }
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(unpackedColors), gl.STATIC_DRAW);
  this.cubeVertexColorBuffer.itemSize = 4;
  this.cubeVertexColorBuffer.numItems = 24;

  
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.cubeVertexIndexBuffer);
  this.cubeVertexIndices = [
      0, 1, 2,      0, 2, 3,    // Front face
      4, 5, 6,      4, 6, 7,    // Back face
      8, 9, 10,     8, 10, 11,  // Top face
      12, 13, 14,   12, 14, 15, // Bottom face
      16, 17, 18,   16, 18, 19, // Right face
      20, 21, 22,   20, 22, 23  // Left face
  ];
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.cubeVertexIndices), gl.STATIC_DRAW);
  this.cubeVertexIndexBuffer.itemSize = 1;
  this.cubeVertexIndexBuffer.numItems = 36;
}

Bullet.prototype.drawPyrPlayerObject = function(playerTexture) {
  gl.useProgram(shaderProgram);
  // Activate texture
  gl.activeTexture(gl.TEXTURE0);
  // Bind texture
  gl.bindTexture(gl.TEXTURE_2D, this.texture);
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

Bullet.prototype.drawCubePlayerObject = function(playerTexture) {

  gl.useProgram(shaderCubeProgram);
  gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexPositionBuffer);
  gl.vertexAttribPointer(shaderCubeProgram.vertexPositionAttribute, this.cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexColorBuffer);
  gl.vertexAttribPointer(shaderCubeProgram.vertexColorAttribute, this.cubeVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.cubeVertexIndexBuffer);
  setMatrixUniformsCube();
  gl.drawElements(gl.TRIANGLES, this.cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

}

