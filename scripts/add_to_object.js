this.gunOnCooldown = false;
this.gunCooldownTime = 500; // ms








PlayerObject.prototype.autoShoot = function(cubes) {

  setInterval(() => {
    if (!this.gunOnCooldown) {
      cubes.forEach((cube) => {
        const dx = cube.xPos - this.xPos;
        const dy = cube.yPos - this.yPos;
        const dz = cube.zPos - this.zPos;
        const distance = Math.pow(dx, 2) + Math.pow(dy, 2) + Math.pow(dz, 2);
        if (distance <= this.shootRange) {
          this.shoot(cube.xPos, cube.yPos, cube.zPos);
        }
      });
    }
  }, 15);
  
}

PlayerObject.prototype.shoot = function(x, y, z) {
  
  // set gun cooldown to true
  this.gunOnCooldown = true;
  setTimeout(function() {
    // after the set gunCooldownTime, set onCoolDown to false, so the player can shoot again
    this.gunOnCooldown = false;
  }, this.gunCooldownTime);
  
  // TODO
}
