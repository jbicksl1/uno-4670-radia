export default class GamepadPlayerController {
    constructor(gamepad) {
	this.gamepad = gamepad;
    }

    registerPlayer(player) {
	this.player = player;
    }

    runControls() {
	var acceleration = new Phaser.Math.Vector2(0, 0);
	
	this.isMoving = false;
	if(this.gamepad.accelX() != 0) {
	    this.isMoving = true;
	    acceleration.x += this.gamepad.accelX();
	}
	if(this.gamepad.accelY() != 0) {
	    this.isMoving = true;
	    acceleration.y += this.gamepad.accelY();
	}

	acceleration = acceleration.scale(75);
	acceleration = acceleration.add(this.player.calculateBaseAcceleration());
	this.player.body.acceleration = acceleration;
	
	if((this.gamepad.jumpX() != 0 || this.gamepad.jumpY() != 0) && this.gamepad.jumpButton()) {
	    this.player.thrust(new Phaser.Math.Vector2(this.gamepad.jumpX(), this.gamepad.jumpY()));
	}
    }
}
