export default class GamepadPlayerController {
    constructor(gamepad) {
	this.gamepad = gamepad;
    }

    registerPlayer(player) {
	this.player = player;
    }

    runControls() {
	this.player.body.acceleration = this.player.calculateBaseAcceleration().add(this.gamepad.leftStick.scale(75));
	this.isMoving = this.gamepad.leftStick.lengthSq() > 0;

	if(this.gamepad.rightStick.lengthSq() > 0 && this.gamepad.R1) {
	    this.player.thrust(this.gamepad.rightStick);
	}
    }
}
