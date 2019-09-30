import PlayerObject from '/game/PlayerObject.js';
import GamepadPlayerController from '/game/GamepadPlayerController.js';
import RadiusObject from '/game/RadiusObject.js';

export default class GameScene extends Phaser.Scene {
    preload() {
	this.load.image('player', '/assets/radia_player.png');
	this.load.image('pellet', '/assets/radia_pellet.png');
	this.load.image('radius', '/assets/radia_radius.png');
    }

    create() {
	this.particles = this.add.particles('pellet');
	console.log(this.input.gamepad.gamepads);
	_.map(this.input.gamepad.gamepads, (pad) => this.createPlayerAndController(pad));
	this.input.gamepad.once('connected', (pad) => this.createPlayerAndController(pad));
    }

    createPlayerAndController(pad) {
	var playerController = new GamepadPlayerController(pad);
	var player = this.spawnPlayer(playerController);
    }

    spawnPlayer(controller) {
	var player = new PlayerObject(this, this.cameras.main.centerX, this.cameras.main.centerY, Phaser.Math.FloatBetween(0.0, 1.0), controller);
	controller.registerPlayer(player);
	console.log(player.hue);
    }
}
