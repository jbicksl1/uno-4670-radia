export default class GamepadPlayerController {
    constructor(gamepad) {
	this.gamepad = gamepad;
    }

    registerPlayer(player) {
	this.player = player;
    }
}
