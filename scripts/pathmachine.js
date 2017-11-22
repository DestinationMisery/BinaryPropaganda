const randomPyramidPath = [
  {
    direction: 'L',
    amount: 20
  },
  {
    wait: Math.random() * 1000,
    direction: 'F',
    amount: Math.random() * 50
  },
  {
    wait: Math.random() * 1000,
    direction: 'RF',
    amount: Math.random() * 50
  },
  {
    wait: Math.random() * 1000,
    direction: 'LF',
    amount: Math.random() * 50
  },
  {
    wait: Math.random() * 1000,
    direction: 'L',
    amount: Math.random() * 50
  },
  {
    wait: Math.random() * 1000,
    direction: 'F',
    amount: Math.random() * 50
  },
  {
    wait: Math.random() * 1000,
    direction: 'RF',
    amount: Math.random() * 50
  }
];

PlayerObject.prototype.executePath = function(path, times) {
  let _this = this;
  let iter = 0;
  let iterator = setInterval(() => {
    if (iter >= times) {
      clearInterval(iterator);
    }
    path.forEach((directionSwitch) => {
      setTimeout(() => {
        let curr = 0;
        let doubleSwitchAmount = directionSwitch.amount / Math.sqrt(2);
        switch (directionSwitch.direction) {
          case 'L':
            simulatePath(_this, directionSwitch.amount, -movementSpeedWASD, 0);
            break;
          case 'F':
            simulatePath(_this, directionSwitch.amount, 0, -movementSpeedWASD);
            break;
          case 'R':
            simulatePath(_this, directionSwitch.amount, movementSpeedWASD, 0);
            break;
          case 'B':
            simulatePath(_this, directionSwitch.amount, 0, movementSpeedWASD);
            break;
          case 'LF':
            simulatePath(_this, doubleSwitchAmount, -movementSpeedWASD, -movementSpeedWASD);
            break;
          case 'LB':
            simulatePath(_this, doubleSwitchAmount, -movementSpeedWASD, movementSpeedWASD);
            break;
          case 'RF':
            simulatePath(_this, doubleSwitchAmount, movementSpeedWASD, -movementSpeedWASD);
            break;
          case 'RB':
            simulatePath(_this, doubleSwitchAmount, movementSpeedWASD, movementSpeedWASD);
            break;  
          default:
            break;
        }
      }, directionSwitch.wait)
      
    });
    iter++;
  }, 3000);
  
}

function simulatePath(obj, amount, dx, dy) {
  let curr = 0;
  let go = setInterval(() => {
    if (curr >= amount) {
      clearInterval(go);
    }
    obj.move(dx, dy);
    curr++;
  }, 15);
}