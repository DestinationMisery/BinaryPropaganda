let cubeTexture;
let cubeTexturesLoaded = false;

function initCubeTextures() {
  // pyrTexture = gl.createTexture();
  // pyrTexture.image = new Image();
  // pyrTexture.image.onload = function () {
  //   pyrHandleTextureLoaded(pyrTexture);
  // }
  // pyrTexture.image.src = "./assets/star.gif";
  cubeHandleTextureLoaded(/*TODO*/);
}

function cubeHandleTextureLoaded (texture) {
  // gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  // // Third texture usus Linear interpolation approximation with nearest Mipmap selection
  // gl.bindTexture(gl.TEXTURE_2D, texture);
  // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
  // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // gl.generateMipmap(gl.TEXTURE_2D);

  // gl.bindTexture(gl.TEXTURE_2D, null);

  // // when texture loading is finished we can draw scenes
  cubeTexturesLoaded = true;
}