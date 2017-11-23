let hotspotTexture;
let hotspotTexturesLoaded = false;

function Hotspot(xPos, zPos, scale) {
  this.xPos = xPos;
  this.zPos = zPos;
  this.scale = scale;

  this.rotX = 0;
  this.rotY = 0;
  this.rotZ = 0;
}

Hotspot.prototype.draw = function () {

  gl.useProgram(shaderProgram);
  this.setPyrVerticesAndTextureCoordinates();

  mvPushMatrix();

  mat4.translate(mvMatrix, [this.xPos, 0, this.zPos]);  

  mat4.rotate(mvMatrix, degToRad(this.rotX), [1, 0, 0]);
  mat4.rotate(mvMatrix, degToRad(this.rotY), [0, 1, 0]);
  mat4.rotate(mvMatrix, degToRad(this.rotZ), [0, 0, 1]);
  

  this.initHotspotBuffer();
  this.drawHotspotObject();
  
  mvPopMatrix();
}

Hotspot.prototype.initHotspotBuffer = function () {

}

Hotspot.prototype.drawHotspotObject = function () {
  
}

function initHotspotTextures() {
  hotspotTexture = gl.createTexture();
  hotspotTexture.image = new Image();
  hotspotTexture.image.onload = function () {
    hotspotHandleTextureLoaded(pyrTexture);
  }
  hotspotTexture.image.src = "./assets/star.gif";
}

function hotspotHandleTextureLoaded (texture) {
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  // Third texture usus Linear interpolation approximation with nearest Mipmap selection
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.generateMipmap(gl.TEXTURE_2D);

  gl.bindTexture(gl.TEXTURE_2D, null);

  // // when texture loading is finished we can draw scenes
  hotspotTexturesLoaded = true;
}