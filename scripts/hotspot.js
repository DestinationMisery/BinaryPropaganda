let hotspotTexture;
let hotspotTexturesLoaded = false;

function Hotspot(xPos, zPos, scale, fillRate) {
  this.xPos = xPos;
  this.zPos = zPos;
  this.scale = scale;

  this.rotX = 90;
  this.rotY = 0;
  this.rotZ = 0;

  this.starVertexPositionBuffer = gl.createBuffer();
  this.starVertexTextureCoordBuffer = gl.createBuffer();

  this.fillRate = fillRate;
}

Hotspot.prototype.draw = function () {

  gl.useProgram(shaderProgram);
  this.setHotspotVerticesAndTextureCoordinates();

  mvPushMatrix();

  mat4.translate(mvMatrix, [this.xPos, 0.05, this.zPos]);  
  
  mat4.rotate(mvMatrix, degToRad(this.rotX), [1, 0, 0]);
  mat4.rotate(mvMatrix, degToRad(this.rotY), [0, 1, 0]);
  mat4.rotate(mvMatrix, degToRad(this.rotZ), [0, 0, 1]);
  

  this.initHotspotBuffer();
  this.drawHotspotObject();
  
  mvPopMatrix();
}

Hotspot.prototype.setHotspotVerticesAndTextureCoordinates = function () {
  this.vertices = [
    1.0,  1.0,  0.0,
   -1.0,  1.0,  0.0,
    1.0, -1.0,  0.0,
   -1.0, -1.0,  0.0
  ];
  this.textureCoords = [
    0.0, 0.0,
    1.0, 0.0,
    0.0, 1.0,
    1.0, 1.0
  ];
}

Hotspot.prototype.initHotspotBuffer = function () {
  
  
  gl.bindBuffer(gl.ARRAY_BUFFER, this.starVertexPositionBuffer);

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
  this.starVertexPositionBuffer.itemSize = 3;
  this.starVertexPositionBuffer.numItems = 4;

  
  gl.bindBuffer(gl.ARRAY_BUFFER, this.starVertexTextureCoordBuffer);

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.textureCoords), gl.STATIC_DRAW);
  this.starVertexTextureCoordBuffer.itemSize = 2;
  this.starVertexTextureCoordBuffer.numItems = 4;
}

Hotspot.prototype.drawHotspotObject = function () {

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, hotspotTexture);
  gl.uniform1i(shaderProgram.samplerUniform, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, this.starVertexTextureCoordBuffer);
  gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, this.starVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, this.starVertexPositionBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.starVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

  setMatrixUniforms();
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.starVertexPositionBuffer.numItems);
}

function initHotspotTextures() {
  hotspotTexture = gl.createTexture();
  hotspotTexture.image = new Image();
  hotspotTexture.image.onload = function () {
    hotspotHandleTextureLoaded(hotspotTexture);
  }
  hotspotTexture.image.src = "./assets/metki.jpg";
}

function hotspotHandleTextureLoaded (texture) {
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  // Third texture usus Linear interpolation approximation with nearest Mipmap selection
  gl.bindTexture(gl.TEXTURE_2D, hotspotTexture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, hotspotTexture.image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.generateMipmap(gl.TEXTURE_2D);

  gl.bindTexture(gl.TEXTURE_2D, null);

  // // when texture loading is finished we can draw scenes
  hotspotTexturesLoaded = true;
}