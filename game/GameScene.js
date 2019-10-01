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
	this.controllerConnected = [false, false, false, false];
	this.colors = [];
	this.colors.push(Phaser.Math.FloatBetween(0.0, 1.0));
	this.colors.push((this.colors[0]+0.5) % 1.0);
	this.colors.push((this.colors[0]+0.25) % 1.0);
	this.colors.push((this.colors[0]+0.75) % 1.0);
    }

    createPlayerAndController(playerNumber) {
	var pad = this.input.gamepad.gamepads[playerNumber];
	var playerController = new GamepadPlayerController(pad);
	var player = this.spawnPlayer(playerNumber, playerController);
    }

    spawnPlayer(playerNumber, playerController) {
	var player = new PlayerObject(this, this.cameras.main.centerX, this.cameras.main.centerY, this.colors[playerNumber], playerController);
	playerController.registerPlayer(player);
    }

    update() {
	_.forEach(this.controllerConnected, (connected, player) => {
	    if(!connected && this.input.gamepad.gamepads[player]) {
		this.createPlayerAndController(player);
		this.controllerConnected[player] = true;
	    }
	});
	
    }
}
