function PlayerObject(type, size, xPos, yPos, zPos, rotX, rotY, rotZ, father, health) {
  this.type = type;
  this.scale = size;
  this.xPos = xPos;
  this.yPos = yPos;
  this.zPos = zPos;
  this.texturesLoaded = false;
  this.speed = 0.03;

  this.rotX = rotX;
  this.rotY = rotY;
  this.rotZ = rotZ;

  this.father = father;
  if(father != null){
    this.offsetX = this.xPos - father.xPos;
    this.offsetZ = this.zPos - father.zPos;
    this.offsetY = this.yPos - father.yPos;
    this.lastDestinationDesignationTime = new Date().getTime();
    this.correctDesignationTime = 400;
  }
  else if(this.type === 'CUBE'){
  	this.newPathTime = 4000;
  	this.lastPathCorrection = 0;
  }

  this.health = health;

  this.gunOnCooldown = false;
  this.gunCooldownTime =1000; // ms

  this.shootRange = 100;

  this.lastShot = 0;

  if (this.type === 'CUBE') {
    this.ammo = 10000000000000;
  } else {
    this.ammo = 10;
  }
 

  this.hoverRange = 0.3;
  this.yPosHoverDown = this.yPos-this.hoverRange;
  this.goingDown = true;

  this.friendlyPlayerVertexPositionBuffer = gl.createBuffer();
  this.friendlyPlayerVertexTextureCoordBuffer = gl.createBuffer();
  this.cubeVertexPositionBuffer = gl.createBuffer();
  this.cubeVertexColorBuffer = gl.createBuffer();
  this.cubeVertexIndexBuffer = gl.createBuffer();
}


PlayerObject.prototype.move = function (dx, dz) {

 
  this.xPos += dx * this.speed;
  this.zPos += dz * this.speed;

  let noProblem = true;
  //check collisions
  for(var i in pyramids){
    let pyramid = pyramids[i];
    if(pyramid == this)
      continue;

    if(this.checkCollision(pyramid)){
      noProblem = false;
      break;
    }
  }

  if(noProblem){
    for(var i in cubes){
      let cube = cubes[i];
      if(cube == this)
        continue;

      if(this.checkCollision(cube)){
        noProblem = false;
        break;
      }
    }
  }

  if(!noProblem){//collsion detected, can't move.
  	this.xPos -= dx * this.speed;
  	this.zPos -= dz * this.speed;
  }
}

PlayerObject.prototype.destroy = function () {
  
  if (this.father === null) {
    // je suis papi
    const winners = this.type === 'PYR' ? 'Cubes' : 'Pyramids';
    let playAgain = confirm(`End of game! ${winners} have won! Play again?`);
    if (playAgain) {
      window.location.reload();
    }
    
  }

  const arrayOfObjects = this.type === 'PYR' ? pyramids : cubes;
  const indexInArray = arrayOfObjects.indexOf(this);
  arrayOfObjects.splice(indexInArray, 1);
}

PlayerObject.prototype.autoShoot = function(cubes) {
  if (new Date().getTime() - this.lastShot >= this.gunCooldownTime && this.ammo > 0) {
    let cubesWithDistances = [];
    cubes.forEach((cube) => {
      const dx = cube.xPos - this.xPos;
      const dy = cube.yPos - this.yPos;
      const dz = cube.zPos - this.zPos;
      const distance = Math.pow(dx, 2) + Math.pow(dy, 2) + Math.pow(dz, 2);
      if (distance <= this.shootRange) {
        cubesWithDistances.push({
          cube,
          distance
        });
      }
    });
    if (cubesWithDistances.length > 0) {
      let closestCube = null;
      let minDist = 1000000;
      cubesWithDistances.forEach((cube) => {
        if (cube.distance < minDist) {
          minDist = cube.distance;
          closestCube = cube;
        }
      });
      this.shoot(closestCube.cube.xPos, closestCube.cube.yPos, closestCube.cube.zPos);
    }
  }
}

PlayerObject.prototype.shoot = function(x, y, z) {
  this.lastShot = new Date().getTime();
  this.ammo--;

  let enemies = this.type === 'PYR' ? cubes : pyramids;
  
  // TODO
  bullets.push(new Bullet(this.type, 0.05, 0.05, this.xPos, this.yPos, this.zPos, x-this.xPos, y-this.yPos, z-this.zPos, enemies));

  
}

PlayerObject.prototype.draw = function () {

  this.hover();
  if(this.father != null){
    this.moveTowardsFather();
  }
  else if(this.type === 'CUBE'){//instructions for father cube
  	this.AIPathing();
  }

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

PlayerObject.prototype.AIPathing = function(){
	if(new Date().getTime() - this.lastPathCorrection > this.newPathTime){//change destination
		let ranX = Math.random() * 20;
		if(Math.random() < 0.5) //in half of the cases, they are going to move left, half right
			ranX *= -1;

		let ranZ = Math.random() * 20;
		if(Math.random() < 0.5)
			ranZ *= -1;

		this.desX = this.xPos + ranX;
		this.desZ = this.zPos + ranZ;

		this.lastPathCorrection = new Date().getTime();
		this.newPathTime = 3000 + Math.random() * 2000; //range 3sec-5sec
	}

	if(this.desX != null){ //we have a destination
		//move
		let dist = Math.sqrt(Math.pow(this.desX - this.xPos, 2) + Math.pow(this.desZ - this.zPos, 2));
		let dx = (this.desX - this.xPos) / dist;
		let dz = (this.desZ - this.zPos) / dist;
		this.move(dx, dz);
		
	}
	

}


PlayerObject.prototype.moveTowardsFather = function(){
  if(new Date().getTime() - this.lastDestinationDesignationTime < this.correctDesignationTime){//don't change direction
		if(this.desX == null)
			return;
  }
  else{//change direction
    this.lastDestinationDesignationTime = new Date().getTime();
    this.correctDesignationTime = 400 * (Math.random() * 0.4 + 0.8);
    this.desX = this.father.xPos + (Math.random() * 0.6 + 0.7) * this.offsetX;
    this.desZ = this.father.zPos + (Math.random() * 0.6 + 0.7) * this.offsetZ;
    this.desY = this.father.yPos + (Math.random() * 0.6 + 0.7) * this.offsetY;
  }

  //move the object
  this.xPos += (this.desX - this.xPos) * this.speed;
  this.zPos += (this.desZ - this.zPos) * this.speed;
  let noProblem = true;
  //check collisions
  for(var i in pyramids){
    let pyramid = pyramids[i];
    if(pyramid == this)
      continue;

    if(this.checkCollision(pyramid)){
      noProblem = false;
      break;
    }
  }

  if(noProblem){
    for(var i in cubes){
      let cube = cubes[i];
      if(cube == this)
        continue;

      if(this.checkCollision(cube)){
        noProblem = false;
        break;
      }
    }
  }
	let dist = Math.sqrt(Math.pow(this.xPos - this.desX, 2) + Math.pow(this.yPos - this.desY, 2));
  if(!noProblem){//there is a collision, don't move.
    this.xPos -= (this.desX - this.xPos) * this.speed;
    this.zPos -= (this.desZ - this.zPos) * this.speed;
  }
  else if(dist < 0.5){//very close to our destination, so will not move
    this.xPos -= (this.desX - this.xPos) * this.speed;
    this.yPos -= (this.desY - this.yPos) * this.speed;
  }


}

let sqrt2 = Math.sqrt(2);
PlayerObject.prototype.checkCollision = function (obj) {
  let disX = obj.xPos - this.xPos;
  let disZ = obj.zPos - this.zPos;
  let distance = Math.sqrt(Math.pow(disX, 2) + Math.pow(disZ, 2));
  let thisScale = this.scale * sqrt2;
  let objScale = obj.scale * sqrt2;

  if(thisScale + obj.scale > distance)
    return true;

  return false;
}

PlayerObject.prototype.hover = function () {



  if(this.goingDown && this.yPos > this.yPosHoverDown){
    this.yPos -= 0.35/50;
  }
  else{
    this.goingDown = false;
  }

  if(this.goingDown == false && this.yPos < this.yPosHoverDown + this.hoverRange){
    this.yPos += 0.35/50;
  }
  else{
    this.goingDown = true;
  }
  

  if(this.type === "CUBE"){
    this.rotX += 1 * (1/Math.pow(this.scale, 2)) / 10;
    this.rotZ += 1 * (1/Math.pow(this.scale, 2)) / 10;
  }

  this.rotY += 1 * (1/Math.pow(this.scale, 2)) / 5;
};

PlayerObject.prototype.setPyrVerticesAndTextureCoordinates = function() {
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

PlayerObject.prototype.setCubeVerticesAndTextureCoordinates = function() {
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

PlayerObject.prototype.initPyramidBuffer = function() {
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

PlayerObject.prototype.initCubeBuffer = function() {
  
  
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

PlayerObject.prototype.drawPyrPlayerObject = function(playerTexture) {
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

PlayerObject.prototype.drawCubePlayerObject = function(playerTexture) {

  gl.useProgram(shaderCubeProgram);
  gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexPositionBuffer);
  gl.vertexAttribPointer(shaderCubeProgram.vertexPositionAttribute, this.cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexColorBuffer);
  gl.vertexAttribPointer(shaderCubeProgram.vertexColorAttribute, this.cubeVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.cubeVertexIndexBuffer);
  setMatrixUniformsCube();
  gl.drawElements(gl.TRIANGLES, this.cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

}

PlayerObject.prototype.fillBulletsIfPossible = function (hotspots) {
  hotspots.forEach((hotspot) => {
    const xLowerBound = hotspot.xPos - hotspot.scale/2;
    const xUpperBound = hotspot.xPos + hotspot.scale/2;

    const zLowerBound = hotspot.zPos - hotspot.scale/2;
    const zUpperBound = hotspot.zPos + hotspot.scale/2;
    if (this.xPos >= xLowerBound && this.xPos <= xUpperBound && this.zPos >= zLowerBound && this.zPos <= zUpperBound) {
      this.ammo += hotspot.fillRate;
    }
  });
}

