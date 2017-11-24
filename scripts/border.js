function Border(xPos, yPos, zPos, rotX, rotY, rotZ, xSc, ySc, zSc) {
  this.texturesLoaded = false;

  this.xPos = xPos;
  this.yPos = yPos;
  this.zPos = zPos;

  this.rotX = rotX;
  this.rotY = rotY;
  this.rotZ = rotZ;

  this.xSc = xSc;
  this.ySc = ySc;
  this.zSc = zSc;


  this.cubeVertexPositionBuffer = gl.createBuffer();
  this.cubeVertexColorBuffer = gl.createBuffer();
  this.cubeVertexIndexBuffer = gl.createBuffer();
}


Border.prototype.draw = function () {

  gl.useProgram(shaderProgram);
  this.setCubeVerticesAndTextureCoordinates();

  mvPushMatrix();


  mat4.translate(mvMatrix, [this.xPos, this.yPos, this.zPos]);  

  mat4.rotate(mvMatrix, degToRad(this.rotX), [1, 0, 0]);
  mat4.rotate(mvMatrix, degToRad(this.rotY), [0, 1, 0]);
  mat4.rotate(mvMatrix, degToRad(this.rotZ), [0, 0, 1]);

  mat4.scale(mvMatrix, [this.xSc, this.ySc, this.zSc]);


  this.initCubeBuffer();
  this.drawCube();

  mvPopMatrix();

  
}



Border.prototype.setCubeVerticesAndTextureCoordinates = function() {
  // pyramid vertices
  this.vertices = [
    // Front face
    -1.0, -1.0,  1.0,
     1.0, -1.0,  1.0,
     1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0,

    // Back face
    -1.0, -1.0, -1.0,
    -1.0,  1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0, -1.0, -1.0,

    // Top face
    -1.0,  1.0, -1.0,
    -1.0,  1.0,  1.0,
     1.0,  1.0,  1.0,
     1.0,  1.0, -1.0,

    // Bottom face
    -1.0, -1.0, -1.0,
     1.0, -1.0, -1.0,
     1.0, -1.0,  1.0,
    -1.0, -1.0,  1.0,

    // Right face
     1.0, -1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0,  1.0,  1.0,
     1.0, -1.0,  1.0,

    // Left face
    -1.0, -1.0, -1.0,
    -1.0, -1.0,  1.0,
    -1.0,  1.0,  1.0,
    -1.0,  1.0, -1.0,
  ];
  this.texture = pyrTexture; // pulled from the global scope of the initally setup textures
  this.colors = [
    // Front face
    0.9, 0.9, 0.9, 1.0,
    0.9, 0.9, 0.9, 1.0,
    0.9, 0.9, 0.9, 1.0,

    // Back face
    0.9, 0.9, 0.9, 1.0,
    0.9, 0.9, 0.9, 1.0,
    0.9, 0.9, 0.9, 1.0,

    // Left face
    0.9, 0.9, 0.9, 1.0,
    0.9, 0.9, 0.9, 1.0,
    0.9, 0.9, 0.9, 1.0,

    // Right face
    0.9, 0.9, 0.9, 1.0,
    0.9, 0.9, 0.9, 1.0,
    0.9, 0.9, 0.9, 1.0,
  ];
}



Border.prototype.initCubeBuffer = function() {
  
  
  gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexPositionBuffer);
 
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
  this.cubeVertexPositionBuffer.itemSize = 3;
  this.cubeVertexPositionBuffer.numItems = 24;

  
  gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexColorBuffer);
  colors = [
      [0.8, 0.8, 0.8, 1.0], // Front face
      [0.8, 0.8, 0.8, 1.0], // Back face
      [0.9, 0.9, 0.9, 1.0], // Top face
      [0.9, 0.9, 0.9, 1.0], // Bottom face
      [0.8, 0.8, 0.8, 1.0], // Right face
      [0.8, 0.8, 0.8, 1.0]  // Left face
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



Border.prototype.drawCube = function(playerTexture) {

  gl.useProgram(shaderCubeProgram);
  gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexPositionBuffer);
  gl.vertexAttribPointer(shaderCubeProgram.vertexPositionAttribute, this.cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexColorBuffer);
  gl.vertexAttribPointer(shaderCubeProgram.vertexColorAttribute, this.cubeVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.cubeVertexIndexBuffer);
  setMatrixUniformsCube();
  gl.drawElements(gl.TRIANGLES, this.cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

}



